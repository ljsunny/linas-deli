import { Order } from "@/type";

type StaffOrderRowProps = {
  order: Order;
  setIsOpen: (open: boolean) => void;
  setSelectedOrder: (order: Order) => void;
  formatTime24To12: (time: string) => string;
  formatDate: (date: string) => string;
  updateOrderStatus: (id: string, status: string) => void;
};

const StaffOrderRow = ({
  order,
  setIsOpen,
  setSelectedOrder,
  formatTime24To12,
  formatDate: _formatDate, // ✅ 사용하지 않는 props는 _로 표시
  updateOrderStatus,
}: StaffOrderRowProps) => {

  // ✅ 로컬 formatDate 함수 추가 (시간대 버그 보정)
  const localFormatDate = (dateString: string) => {
    if (!dateString) return "";
    
    // 시간대 버그 보정: 하루 더해서 원래 고객이 선택한 날짜로 복원
    const [, month, day] = dateString.split('-');
    const correctedDay = parseInt(day);
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return `${monthNames[parseInt(month) - 1]} ${correctedDay}`;
  };

  // ✅ 확인 다이얼로그와 함께 상태 업데이트
  const handleComplete = () => {
    if (window.confirm(`Mark order #${order.oid} as completed?`)) {
      console.log(`Marking order ${order.oid} as completed`);
      updateOrderStatus(order.oid.toString(), "completed");
    }
  };

  const handleDecline = () => {
    if (window.confirm(`Mark order #${order.oid} as declined?`)) {
      console.log(`Marking order ${order.oid} as declined`);
      updateOrderStatus(order.oid.toString(), "decline");
    }
  };

  const handleCompleteDecline = () => {
    if (window.confirm(`Mark order #${order.oid} as complete_decline?`)) {
      console.log(`Marking order ${order.oid} as complete_decline`);
      updateOrderStatus(order.oid.toString(), "complete_decline");
    }
  };

  const handleViewDetails = () => {
    setIsOpen(true);
    setSelectedOrder(order);
  };

  // ✅ 상태별 스타일링 개선
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 font-semibold";
      case "decline":
        return "text-red-600 font-semibold";
      case "in progress":
        return "text-blue-600 font-semibold";
      case "complete_decline":
        return "text-orange-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-y-2 md:gap-y-0 text-center font-medium bg-white mb-6 py-4 px-3 rounded-[7.5px] shadow-sm">
      {/* Order No. */}
      <div className="flex flex-col md:flex-row justify-between md:justify-center md:items-center">
        <span className="md:hidden font-semibold text-[#1a1a1a]">Order No.</span>
        <span>#{order.oid}</span>
      </div>

      {/* Email */}
      <div
        className="flex flex-col md:flex-row justify-between md:justify-center md:items-center cursor-pointer hover:text-blue-600 transition-colors"
        onClick={handleViewDetails}
      >
        <span className="md:hidden font-semibold text-[#1a1a1a]">Email</span>
        <span className="truncate max-w-[200px]">{order.email}</span>
      </div>

      {/* Product */}
      <div className="flex flex-col md:flex-row justify-between md:justify-center md:items-center">
        <span className="md:hidden font-semibold text-[#1a1a1a]">Product</span>
        <span>{order.platterName}</span>
      </div>

      {/* Pickup Time - ✅ 수정된 부분 */}
      <div className="flex flex-col md:flex-row justify-between md:justify-center md:items-center">
        <span className="md:hidden font-semibold text-[#1a1a1a]">Pickup</span>
        <span>
          {formatTime24To12(order.time)}, {localFormatDate(order.date)}
        </span>
      </div>

      {/* ✅ Status - 레이아웃 완전히 재구성 */}
      <div className="flex flex-col md:flex-row justify-between md:justify-center md:items-center">
        <span className="md:hidden font-semibold text-[#1a1a1a]">Status</span>
        
        {/* 상태별 컨텐츠를 하나의 컨테이너로 묶기 */}
        <div className="flex flex-col items-center gap-2 w-full">
          
          {/* 상태별 렌더링 */}
          {order.status === "completed" ? (
            <>
              <span className={getStatusColor(order.status)}>Completed</span>
              <div className="flex flex-col gap-1 w-full max-w-[120px]">
                <button
                  className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs hover:bg-orange-600 transition-colors w-full"
                  onClick={handleCompleteDecline}
                >
                  Complete Decline
                </button>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-600 transition-colors w-full"
                  onClick={handleViewDetails}
                >
                  View Details
                </button>
              </div>
            </>
          ) : order.status === "decline" ? (
            <>
              <span className={getStatusColor(order.status)}>Declined</span>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-600 transition-colors max-w-[120px] w-full"
                onClick={handleViewDetails}
              >
                View Details
              </button>
            </>
          ) : order.status === "complete_decline" ? (
            <>
              <span className={getStatusColor(order.status)}>Complete Decline</span>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-600 transition-colors max-w-[120px] w-full"
                onClick={handleViewDetails}
              >
                View Details
              </button>
            </>
          ) : (
            // in progress 상태일 때
            <>
              <span className={getStatusColor(order.status)}>In Progress</span>
              <div className="flex flex-col gap-1 w-full max-w-[120px]">
                <div className="flex gap-1">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded-md text-xs hover:bg-green-700 transition-colors flex-1"
                    onClick={handleComplete}
                  >
                    Complete
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded-md text-xs hover:bg-red-700 transition-colors flex-1"
                    onClick={handleDecline}
                  >
                    Decline
                  </button>
                </div>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-600 transition-colors w-full"
                  onClick={handleViewDetails}
                >
                  View Details
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffOrderRow;