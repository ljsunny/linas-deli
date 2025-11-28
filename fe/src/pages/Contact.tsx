import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import storeImage from "@/assets/contact/contact.jpeg"; // 매장 이미지
import logo from "@/assets/logo.png"; // 로고
import { FaPhone, FaEnvelope, FaClock, FaInstagram } from "react-icons/fa";
import PageBanner from "@/components/PageBanner";
import { useRef } from "react";


const center = {
  lat: 49.27232088405721,
  lng: -123.13525873723947,
};

const Contact = () => {
  const mapRef = useRef<google.maps.Map | null>(null);

  // 📌 Google Map이 로드되었을 때 실행
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    // 🔥 lg에서만 지도 화면을 오른쪽으로 이동
    if (window.innerWidth >= 1024) {
      setTimeout(() => {
        map.panBy(-100, 0); // x축 100px 이동 (오른쪽으로)
      }, 500); // 맵 로딩 후 실행
    }
  };


  return (
    <div>
      <PageBanner title="Contact Us" />

      <section className="py-12 lg:pt-30 lg:pb-20">
        {/* 제목 */}
        <h2 className="text-xl sm:text-4xl font-bold text-center mb-6 lg:hidden">Contact Information</h2>

        {/* Google Map */}
        <div className="w-full h-[300px] overflow-hidden mb-6 lg:h-[480px]">
          <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={15}
              onLoad={handleMapLoad}
              options={{
                disableDefaultUI: false, 
                streetViewControl: false, // ❌ Street View 제거 (사람 아이콘 삭제)
              }}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScriptNext>
        </div>

        {/* 매장 이미지 & 정보 카드 */}
        <div className="mx-10 relative -mt-30 bg-[#FFF8ED] rounded-lg shadow-md overflow-hidden z-20 
          lg:w-[400px] lg:h-[670px] lg:-mt-140 lg:mx-20">
          {/* 이미지 섹션 */}
          <div className="relative">
            <img src={storeImage} alt="Store" className="w-full h-56 object-cover lg:mb-2" />
            <img
              src={logo}
              alt="Store Logo"
              className="absolute left-6 -bottom-6 w-16 h-16 rounded-full object-cover border-white"
            />
          </div>

          {/* 매장 정보 */}
          <div className="p-6 lg:p-10">
            <p className="text-lg font-semibold text-center lg:text-left">
              1689 Johnston St, Vancouver, BC V6H 3S2
            </p>

            <div className="border-t border-gray-300 my-4"></div>

            {/* 연락처 정보 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 lg:gap-5">
                <FaPhone className="text-gray-600 text-xl" />
                <p className="text-gray-700"><span className="hidden lg:block">Phone</span> +1 (604)-688-8881</p>
              </div>
              <div className="border-t border-gray-300 my-4 hidden lg:block"></div>

              <div className="flex items-center gap-3 lg:gap-5">
                <FaEnvelope className="text-gray-600 text-xl" />
                <p className="text-gray-700"><span className="hidden lg:block">E-mail</span> linasdeli.info@gmail.com</p>
              </div>

              <div className="border-t border-gray-300 my-4 hidden lg:block"></div>

              <div className="flex items-center gap-3 lg:gap-5">
                <FaClock className="text-gray-600 text-xl" />
                <p className="text-gray-700"><span className="hidden lg:block">Time</span>
                  Mon-Sun : 8:00 AM ~ 18:00 PM <br />
                  (Hours might differ on Holidays)
                </p>
              </div>
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            {/* 소셜 미디어 */}
            <div className="flex justify-end gap-4">
              <a href="https://www.instagram.com/linasdeli/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-gray-600 text-2xl hover:text-black" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;