package com.linasdeli.api.controller;

import com.linasdeli.api.dto.OrderDTO;
import com.linasdeli.api.dto.request.OrderRequestDTO;
import com.linasdeli.api.dto.request.DonationRequestDTO;
import com.linasdeli.api.service.EmailService;
import com.linasdeli.api.service.OrderService;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payments")
public class StripeController {

    private final OrderService orderService;
    private final EmailService emailService;

    @Value("${stripe.api.secret.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    // 후원 감사 이메일 발송 메서드 - 후원자에게도 이메일 발송
    private void sendDonationThankYouEmails(String donorName, String amount, String message, String donorEmail) {
        try {
            // 1. 사장님께 후원 알림 이메일
            String ownerSubject = "💝 New Donation Received - Lina's Deli";
            String ownerBody = String.format("""
                <h2>💝 New Donation Received!</h2>
                <p>Dear Lina's Deli Team,</p>
                <p>Great news! You have received a new donation.</p>
                
                <h3>Donation Details:</h3>
                <ul>
                    <li><strong>Amount:</strong> %s CAD</li>
                    <li><strong>Donor:</strong> %s</li>
                    <li><strong>Email:</strong> %s</li>
                    <li><strong>Message:</strong> %s</li>
                    <li><strong>Date:</strong> %s</li>
                </ul>
                
                <p>Thank you for continuing to serve our wonderful community!</p>
                
                <p>Best regards,<br>
                Lina's Deli Payment System</p>
                """,
                    amount,
                    donorName.isEmpty() ? "Anonymous" : donorName,
                    donorEmail != null ? donorEmail : "Not provided",
                    message.isEmpty() ? "No message" : message,
                    new java.util.Date()
            );

            emailService.sendEmail("linasdeli@gmail.com", ownerSubject, ownerBody);
            log.info("📧 Owner notification email sent for donation");

            // 2. 후원자에게 감사 이메일 발송
            if (donorEmail != null && !donorEmail.trim().isEmpty()) {
                String donorSubject = "Thank you for supporting Lina's Deli! 💝";
                String donorBody = String.format("""
                    <h2>💝 Thank you for your support!</h2>
                    <p>Dear %s,</p>
                    
                    <p>Thank you so much for your generous donation of <strong>%s</strong> to Lina's Deli!</p>
                    
                    <p>Your support means the world to us and helps us continue serving our wonderful community with delicious food and warm hospitality.</p>
                    
                    <p>We are truly grateful for customers like you who make our family business possible.</p>
                    
                    <p>With heartfelt appreciation,<br>
                    <strong>The Lina's Deli Team</strong></p>
                    
                    <p><em>P.S. We'd love to see you again soon! 🥪❤️</em></p>
                    
                    <hr>
                    <p><small>
                    <strong>Visit us at:</strong> 1689 Johnston St, Vancouver, BC V6H 3S2<br>
                    <strong>Call us:</strong> (604) 688-8881
                    </small></p>
                    """,
                        donorName.isEmpty() ? "Friend" : donorName,
                        amount
                );

                emailService.sendEmail(donorEmail, donorSubject, donorBody);
                log.info("📧 Thank you email sent to donor: {}", donorEmail);
            } else {
                log.info("ℹ️ No donor email provided, skipping donor thank you email");
            }

        } catch (Exception e) {
            log.error("❌ Failed to send donation emails: {}", e.getMessage(), e);
            throw e; // 에러를 다시 던져서 호출하는 곳에서 처리
        }
    }

    public StripeController(OrderService orderService, EmailService emailService) {
        this.orderService = orderService;
        this.emailService = emailService;
    }

    private static final Map<String, String> priceIdMap = Map.of(
            "PETITE BOX", "price_1RjCjZDurDSTecKKOwU2T5yl",
            "MEDIUM BOX", "price_1RjCkKDurDSTecKKvJnvBFCp",
            "LARGE BOX", "price_1RjClDDurDSTecKKJQjRL7O4",
            "PETITE", "price_1RjCjZDurDSTecKKOwU2T5yl",
            "MEDIUM", "price_1RjCkKDurDSTecKKvJnvBFCp",
            "LARGE", "price_1RjClDDurDSTecKKJQjRL7O4"
    );

    // $1 후원만 간단하게
    private static final Map<String, String> donationPriceMap = Map.of(
            "DONATION_1", "price_1RjXGSDurDSTecKK5JkCFucA"  // 실제 Price ID
    );

    @PostMapping("/create-checkout-session")
    public ResponseEntity<String> createCheckoutSession(@RequestBody OrderRequestDTO orderRequestDTO) throws Exception {
        OrderDTO savedOrder = orderService.createOrder(orderRequestDTO);
        String priceId = priceIdMap.get(orderRequestDTO.getPlatterName());

        if (priceId == null) {
            log.error("Invalid platter type: {}", orderRequestDTO.getPlatterName());
            return ResponseEntity.badRequest().body("Invalid platter type");
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("https://linas-deli.ca/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("https://linas-deli.ca/cancel?session_id={CHECKOUT_SESSION_ID}")
//                .setSuccessUrl("http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}")
//                .setCancelUrl("http://localhost:5173/cancel?session_id={CHECKOUT_SESSION_ID}") // session_id 추가
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build())
                .setAutomaticTax(SessionCreateParams.AutomaticTax.builder()
                        .setEnabled(true)
                        .build())
                .setBillingAddressCollection(SessionCreateParams.BillingAddressCollection.REQUIRED)
                .putMetadata("type", "order")
                .putMetadata("orderId", String.valueOf(savedOrder.getOid()))
                .putMetadata("email", orderRequestDTO.getEmail())
                .build();

        Session session = Session.create(params);
        log.info("Session created: {}, orderId: {}", session.getId(), savedOrder.getOid());

        return ResponseEntity.ok(session.getUrl());
    }

    // $1 후원 세션 생성 API
    @PostMapping("/create-donation-session")
    public ResponseEntity<String> createDonationSession(@RequestBody DonationRequestDTO donationRequestDTO) {
        try {
            log.info("Creating donation session for amount: {}", donationRequestDTO.getDonationAmount());

            String priceId = donationPriceMap.get(donationRequestDTO.getDonationAmount());

            if (priceId == null) {
                log.error("Invalid donation amount: {}", donationRequestDTO.getDonationAmount());
                return ResponseEntity.badRequest().body("Invalid donation amount");
            }

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("https://linas-deli.ca/donation-success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl("https://linas-deli.ca/order") // 주문 페이지로 다시 돌아가기
//                    .setSuccessUrl("http://localhost:5173/donation-success?session_id={CHECKOUT_SESSION_ID}")
//                    .setCancelUrl("http://localhost:5173/order")
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setPrice(priceId)
                            .setQuantity(1L)
                            .build())
                    .putMetadata("type", "donation")
                    .putMetadata("donationAmount", donationRequestDTO.getDonationAmount())
                    .putMetadata("donorName", donationRequestDTO.getDonorName() != null ? donationRequestDTO.getDonorName() : "Anonymous")
                    .putMetadata("message", donationRequestDTO.getMessage() != null ? donationRequestDTO.getMessage() : "")
                    .build();

            Session session = Session.create(params);
            log.info("Donation session created: {}, amount: {}", session.getId(), donationRequestDTO.getDonationAmount());

            return ResponseEntity.ok(session.getUrl());
        } catch (Exception e) {
            log.error("Error creating donation session", e);
            return ResponseEntity.internalServerError().body("Failed to create donation session");
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            log.info("🚀 WEBHOOK RECEIVED - " + new java.util.Date());

            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            log.info("✅ Event type: {}", event.getType());

            if ("checkout.session.completed".equals(event.getType())) {
                log.info("🎯 Processing checkout.session.completed");

                // JSON payload에서 직접 세션 ID 추출
                String sessionId = extractSessionIdFromPayload(payload);
                log.info("🔍 Extracted session ID from payload: {}", sessionId);

                if (sessionId != null) {
                    try {
                        // 세션 ID로 직접 Session 객체 조회
                        Session session = Session.retrieve(sessionId);
                        log.info("✅ Session retrieved: {}", session.getId());
                        log.info("Payment Status: {}", session.getPaymentStatus());
                        log.info("Metadata: {}", session.getMetadata());

                        if ("paid".equalsIgnoreCase(session.getPaymentStatus())) {
                            String type = session.getMetadata().get("type");

                            if ("donation".equals(type)) {
                                // $1 후원 처리
                                log.info("💝 Processing $1 donation payment");
                                String donorName = session.getMetadata().get("donorName");
                                String message = session.getMetadata().get("message");

                                // Stripe에서 고객 이메일 가져오기
                                String donorEmail = null;
                                if (session.getCustomerDetails() != null && session.getCustomerDetails().getEmail() != null) {
                                    donorEmail = session.getCustomerDetails().getEmail();
                                    log.info("📧 Donor email from Stripe: {}", donorEmail);
                                } else {
                                    log.info("ℹ️ No email provided by donor");
                                }

                                log.info("💰 $1 Donation received from: {} ({})", donorName, donorEmail != null ? donorEmail : "no email");

                                // 후원 감사 이메일 발송 (사장님 + 후원자)
                                try {
                                    log.info("📧 Sending donation thank you emails");
                                    sendDonationThankYouEmails(donorName, "$1", message, donorEmail);
                                    log.info("✅ Donation thank you emails sent successfully");
                                } catch (Exception emailError) {
                                    log.error("❌ Failed to send donation thank you emails: {}", emailError.getMessage(), emailError);
                                }

                                log.info("✅ Thank you for supporting Lina's Deli!");

                            } else {
                                // 기존 주문 처리
                                String orderIdStr = session.getMetadata().get("orderId");
                                log.info("Order ID from metadata: {}", orderIdStr);

                                if (orderIdStr != null) {
                                    Long orderId = Long.valueOf(orderIdStr);

                                    // ⚠️ 상태 변경하지 않음 - "in progress" 상태 유지
                                    log.info("💰 Payment confirmed for order: {} (status remains 'in progress')", orderId);

                                    // 이메일만 발송
                                    log.info("📧 Sending payment confirmation emails for order: {}", orderId);
                                    orderService.sendPaymentConfirmationEmails(orderId);
                                    log.info("✅ Email sending process completed");
                                } else {
                                    log.error("❌ Order ID is null in metadata!");
                                }
                            }
                        } else {
                            log.warn("⚠️ Payment status is not 'paid': {}", session.getPaymentStatus());
                        }
                    } catch (Exception e) {
                        log.error("❌ Error retrieving session: {}", e.getMessage(), e);
                    }
                } else {
                    log.error("❌ Could not extract session ID from payload!");
                    log.debug("Payload: {}", payload);
                }
            } else {
                log.info("ℹ️ Ignoring event type: {}", event.getType());
            }
        } catch (SignatureVerificationException e) {
            log.error("❌ Webhook signature error", e);
            return ResponseEntity.badRequest().body("Invalid signature");
        } catch (Exception e) {
            log.error("❌ Webhook processing error", e);
            return ResponseEntity.internalServerError().body("Webhook error");
        }

        return ResponseEntity.ok("Webhook received");
    }

    // 페이로드에서 세션 ID 직접 추출
    private String extractSessionIdFromPayload(String payload) {
        try {
            // checkout session ID 패턴: cs_xxxxx
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\"id\"\\s*:\\s*\"(cs_[A-Za-z0-9_]+)\"");
            java.util.regex.Matcher matcher = pattern.matcher(payload);
            if (matcher.find()) {
                return matcher.group(1);
            }
        } catch (Exception e) {
            log.error("Error extracting session ID from payload: {}", e.getMessage());
        }
        return null;
    }

    @GetMapping("/webhook")
    public ResponseEntity<String> webhookStatus() {
        return ResponseEntity.ok("Webhook endpoint is running");
    }

    @GetMapping("/order-status")
    public ResponseEntity<OrderDTO> getOrderStatus(@RequestParam String sessionId) {
        try {
            Session session = Session.retrieve(sessionId);
            Long orderId = Long.valueOf(session.getMetadata().get("orderId"));

            OrderDTO order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("Error retrieving order status", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/payment-success")
    public ResponseEntity<String> paymentSuccessDeprecated(@RequestParam String sessionId) {
        log.warn("Deprecated endpoint used: /payment-success");
        return ResponseEntity.ok("Please use /order-status instead.");
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelOrder(@RequestBody OrderRequestDTO orderRequestDTO) {
        // 주문 정보 저장 (초기 상태는 optional: 예를 들어 "pending")
        OrderDTO order = orderService.createOrder(orderRequestDTO);

        // 상태를 "declined"로 업데이트
        orderService.updateOrderStatus(order.getOid(), "decline");

        // 이메일은 보내지 않음
        return ResponseEntity.ok("Order cancelled and status set to declined.");
    }

    @PostMapping("/payment-failed")
    public ResponseEntity<String> paymentFailed(@RequestParam String sessionId) {
        log.info("Payment failed for session {}", sessionId);
        return ResponseEntity.ok("Payment failure acknowledged");
    }

    @PostMapping("/cancel-session")
    public ResponseEntity<String> cancelSession(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");

        try {
            log.info("🚫 Processing session cancellation: {}", sessionId);

            Session session = Session.retrieve(sessionId);
            String type = session.getMetadata().get("type");

            if ("donation".equals(type)) {
                // 후원 취소 처리
                log.info("💝 Donation session cancelled: {}", sessionId);
                return ResponseEntity.ok("Donation cancelled");
            } else {
                // 기존 주문 취소 처리
                String orderIdStr = session.getMetadata().get("orderId");

                if (orderIdStr != null) {
                    Long orderId = Long.valueOf(orderIdStr);

                    log.info("📝 Updating order {} status to declined", orderId);
                    orderService.updateOrderStatus(orderId, "decline");
                    log.info("✅ Order {} status updated to declined (no email sent)", orderId);

                    return ResponseEntity.ok("Order cancelled successfully");
                } else {
                    log.warn("⚠️ No orderId found in cancelled session: {}", sessionId);
                    return ResponseEntity.ok("Session processed");
                }
            }

        } catch (Exception e) {
            log.error("❌ Error cancelling session: {}", sessionId, e);
            return ResponseEntity.ok("Cancellation processed"); // 사용자에게는 성공으로 표시
        }
    }
}