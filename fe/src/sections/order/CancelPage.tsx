import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";

const CancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const handleCancellation = async () => {
      if (sessionId) {
        try {
          await api.post("/api/payments/cancel-session", { sessionId });
          console.log("Order cancelled successfully");
        } catch (error) {
          console.error("Error cancelling order:", error);
        }
      }
    };

    handleCancellation();
  }, [sessionId]);

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleTryAgain = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Cancel Header */}
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
            <p className="text-gray-600">Your order has been cancelled. No payment was processed.</p>
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleTryAgain}
              className="w-full bg-[#AD343E] text-white py-3 px-6 rounded-lg hover:bg-[#7D3225] transition font-medium"
            >
              Try Again
            </button>
            
            <button
              onClick={handleReturnHome}
              className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Return to Home
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-gray-600 mb-2">Need help with your order?</p>
            <p className="text-[#AD343E] font-medium">Contact us at linasdeli.info@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;