package com.linasdeli.api.dto.request;

import lombok.Data;

@Data
public class DonationRequestDTO {
    private String donationAmount;  // "DONATION_1", "DONATION_3", "DONATION_5"
    private String donorName;       // 선택사항 - 후원자 이름
    private String message;         // 선택사항 - 후원 메시지
}