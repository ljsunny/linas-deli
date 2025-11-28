import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/api/axios";

// interface PriceMap {
//   [key: string]: number;
// }

const OrderForm = () => {
  const { boxType } = useParams<{ boxType: string }>();
  console.log("boxType from URL:", boxType);

  
  // // 가격 정의 - 대소문자 구분 없이 처리
  // const priceMap: PriceMap = {
  //   "PETITE BOX": 25.00,
  //   "MEDIUM BOX": 45.00,
  //   "LARGE BOX": 65.00,
  //   "petite box": 25.00,
  //   "medium box": 45.00,
  //   "large box": 65.00,
  //   "PETITE": 25.00,
  //   "MEDIUM": 45.00,
  //   "LARGE": 65.00
  // };

  // // 현재 플래터의 가격 계산 - null 체크 추가
  // const currentPrice = boxType ? (priceMap[boxType] || priceMap[boxType.toUpperCase()] || 0) : 0;
  // console.log("Current price:", currentPrice, "for boxType:", boxType);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    customerName: "",
    phone: "",
    email: "",
    allergy: "",
    message: "",
    platterName: boxType || ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // 날짜 입력 시 iOS Safari 대응 검증 (조용하게)
    if (name === 'date') {
      const selectedDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // 시간 초기화
      
      if (selectedDate < tomorrow) {
        // 알림 없이 그냥 리턴 (상태 업데이트 안함)
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!formData.date || !formData.time || !formData.customerName || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // iOS Safari 대응 - submit 시에도 날짜 재검증
    const selectedDate = new Date(formData.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (selectedDate < tomorrow) {
      toast.error("Please select tomorrow or later date.");
      return;
    }
  
    try {
      // Stripe 결제 세션 생성 (주문정보 전체 전송)
      const paymentResponse = await api.post("/api/payments/create-checkout-session", formData);
  
      const url = paymentResponse.data;
      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process order or payment.");
    }
  };

  // Compute tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <input type="hidden" name="platter" value={formData.platterName} />
        
        {/* Date | Time */}
        <div>
          <label className="block text-gray-800 font-semibold">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-4 border text-gray-800 rounded-4xl border-gray-300 text-lg"
            min={minDate}
          />
          <p className="text-sm text-gray-500 mt-1">
            📅 Available from tomorrow onwards
          </p>
        </div>
        <div>
          <label className="block font-semibold text-gray-800">Time</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-4 border text-gray-800 rounded-4xl border-gray-300 text-lg"
          >
            <option value="">Select Time</option>
            <option value="10:00:00">10:00</option>
            <option value="10:30:00">10:30</option>
            <option value="11:00:00">11:00</option>
            <option value="11:30:00">11:30</option>
            <option value="12:00:00">12:00</option>
            <option value="12:30:00">12:30</option>
            <option value="13:00:00">13:00</option>
            <option value="13:30:00">13:30</option>
            <option value="14:00:00">14:00</option>
            <option value="14:30:00">14:30</option>
            <option value="15:00:00">15:00</option>
            <option value="15:30:00">15:30</option>
            <option value="16:00:00">16:00</option>
          </select>
        </div>

        {/* Name */}
        <div className="md:col-span-2">
          <label className="block font-semibold text-gray-800">Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-4 border rounded-4xl border-gray-300 text-lg"
          />
        </div>

        {/* Phone | Email */}
        <div>
          <label className="block font-semibold text-gray-800">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="x-xxx-xxx-xxxx"
            className="w-full p-4 border rounded-4xl border-gray-300 text-lg"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-800">E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-4 border rounded-4xl border-gray-300 text-lg"
          />
        </div>

        {/* Allergy */}
        <div className="md:col-span-2">
          <label className="block font-semibold text-gray-800">Allergy</label>
          <textarea
            name="allergy"
            value={formData.allergy}
            onChange={handleChange}
            placeholder="Let us know about any allergies"
            className="w-full p-4 border rounded-4xl border-gray-300 h-24 text-lg resize-none"
          ></textarea>
        </div>

        {/* Order Message */}
        <div className="md:col-span-2">
          <label className="block font-semibold text-gray-800">Order Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-4 border rounded-4xl border-gray-300 h-24 text-lg resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="w-1/2 p-4 bg-[#AD343E] text-white text-lg rounded-4xl flex items-center justify-center hover:bg-[#7D3225] transition"
          >
            Order →
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;