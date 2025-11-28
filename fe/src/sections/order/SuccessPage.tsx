import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/api/axios";

interface OrderData {
  oid: number;
  customerName: string;
  email: string;
  phone: string;
  platterName: string;
  date: string;
  time: string;
  status: string;
  allergy?: string;
  message?: string;
}

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/payments/order-status?sessionId=${sessionId}`);
        setOrderData(response.data);
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError("Failed to fetch order information");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AD343E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order information...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || "Order information not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your order. We'll prepare it with love!</p>
          </div>

          {/* Order Details */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">#{orderData.oid}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{orderData.customerName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{orderData.email}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{orderData.phone}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium">{orderData.platterName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Date:</span>
                <span className="font-medium">{orderData.date}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Time:</span>
                <span className="font-medium">{orderData.time}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">
                  {orderData.status || 'Confirmed'}
                </span>
              </div>
              
              {orderData.allergy && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Allergies:</span>
                  <span className="font-medium">{orderData.allergy}</span>
                </div>
              )}
              
              {orderData.message && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Special Notes:</span>
                  <span className="font-medium">{orderData.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                You'll receive a confirmation email shortly
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                We'll start preparing your order
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Pick up your order at the scheduled time
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6 mt-6 text-center">
            <p className="text-gray-600 mb-2">Questions about your order?</p>
            <p className="text-[#AD343E] font-medium">Contact us at linasdeli.info@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;