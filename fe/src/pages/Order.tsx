import petiteBox from "@/assets/home/order/board1.jpeg";
import mediumBox from "@/assets/home/order/board2.jpeg";
import largeBox from "@/assets/home/order/board3.jpeg";
import PageBanner from "@/components/PageBanner"
import { useNavigate } from "react-router-dom";

const charcuterieItems = [
  {
    platter_id: 1,
    title: "PETITE",
    serves: "serves 3-4 people",
    image: petiteBox,
    price: "$70",
  },
  {
    platter_id: 2,
    title: "MEDIUM",
    serves: "serves 4-5 people",
    image: mediumBox,
    price: "$85",
  },
  {
    platter_id: 3,
    title: "LARGE",
    serves: "serves 10-12 people",
    image: largeBox,
    price: "$145",
  },
];

// // 후원 옵션 - 1달러만 간단하게
// const donationItem = {
//   id: "DONATION_1",
//   title: "SUPPORT",
//   description: "Support our local deli",
//   price: "$1",
//   emoji: "💝"
// };

const Order = () => {
  const navigate = useNavigate();
  
  // const handleDonation = async (donationId: string) => {
  //   try {
  //     // 후원 결제 세션 생성 API 호출
  //     const response = await fetch('/api/payments/create-donation-session', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         donationAmount: donationId,
  //         donorName: '', // 옵션: 나중에 입력 폼 추가 가능
  //         message: ''   // 옵션: 나중에 입력 폼 추가 가능
  //       }),
  //     });
      
  //     if (response.ok) {
  //       const checkoutUrl = await response.text();
  //       window.location.href = checkoutUrl;
  //     } else {
  //       console.error('Failed to create donation session');
  //       alert('Something went wrong. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('Something went wrong. Please try again.');
  //   }
  // };
  
  return (
    <div>
      <PageBanner title="Order" />
      
      {/* 기존 CHARCUTERIE BOARD 섹션 */}
      <section className="py-12 px-6 text-center lg:px-30">
        <h2 className="text-2xl font-bold text-[#7D4F30] mb-3 tracking-wide lg:text-4xl">
          CHARCUTERIE BOARD
        </h2>
        <p className="text-gray-500 text-sm lg:text-lg max-w-md mx-auto mb-6">
          "We do not accept same-day orders online.  <br />  Please call us for assistance."
        </p>

        <div className="flex flex-col items-center space-y-5 lg:space-y-0 lg:flex-row lg:justify-center lg:gap-6 w-full">
          {charcuterieItems.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col rounded-lg shadow-lg bg-white w-full max-w-[400px] lg:max-w-none"
            >
              <div className="w-full h-30 lg:h-90">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="absolute -bottom-4 lg:bottom-0 lg:w-full lg:h-1/2 right-0 bg-white/95 shadow-lg rounded-lg p-4 w-40 text-center flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold lg:text-xl">{item.title} BOX</h3>
                <p className="text-xs text-gray-500 lg:text-base">{item.serves}</p>
                <p className="text-sm font-semibold text-[#AD343E] lg:text-lg">
                  {item.price} <span className="text-xs font-semibold text-gray-500 lg:text-base">+ tax</span>
                </p>
                <button
                  onClick={() => navigate(`/order/${item.title}`)}
                  className="mt-3 w-full lg:w-2/3 bg-[#AD343E] text-white text-sm lg:text-sm py-1 rounded-3xl flex items-center justify-center gap-1 hover:bg-[#7D3225] transition"
                >
                  Order →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 새로운 후원 섹션 - 심플하게 */}
      {/* <section className="py-8 px-6 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-3">{donationItem.emoji}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Love Lina's Deli?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Support our local family business
            </p>
            <div className="text-lg font-bold text-[#AD343E] mb-4">
              {donationItem.price}
            </div>
            <button
              onClick={() => handleDonation(donationItem.id)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Support Us 💝
            </button>
          </div>
          
          <p className="text-gray-500 text-xs mt-4">
            Secure payment • No account required
          </p>
        </div>
      </section> */}
    </div>
  );
};

export default Order;