import Icon from "@/assets/logo.png";

const Footer = () => {
  return (
    <div className="bg-[#301500] py-12 w-full sm:py-24">
      {/* 상단 구분선 */}
      <hr className="hidden sm:block border-t-2 border-white w-full" />
      <hr className="hidden sm:block custom-dashed-border w-full mt-4 mb-15" />

      <div className="flex justify-between items-center sm:items-end px-8 sm:px-28">
        {/* 로고 영역 */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow sm:w-30 sm:h-30">
          <img
            src={Icon}
            alt="Footer Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* 연락처 정보 */}
        <div className="flex flex-col items-end space-y-2 sm:space-y-4 sm:items-start">
          {/* SNS 아이콘 */}
          <div className="flex sm:hidden">
            <a href="https://www.instagram.com/linasdeli/" className="hover:bg-gray-400 transition">
              <img src="/Icon/Icon_instagram.svg" alt="Instagram Icon" className="w-5 h-5" />
            </a>
          </div>

          {/* Contact 제목 */}
          <h2 className="text-[#A7A7A7] text-md sm:text-white text-base font-medium sm:text-3xl">Contact us</h2>

          {/* 이메일 */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            <img src="/Icon/Mail outline.svg" alt="Mail Icon" className="w-4 h-4 sm:w-7 sm:h-7 sm:filter sm:invert sm:brightness-0 sm:contrast-100" />
            <p className="text-[#A7A7A7] text-sm sm:text-white text-sm font-normal sm:text-xl">linasdeli.info@gmail.com</p>
          </div>

          {/* 전화번호 */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            <img src="/Icon/Icon_call.svg" alt="Call Icon" className="w-4 h-4 sm:w-7 sm:h-7 sm:filter sm:invert sm:brightness-0 sm:contrast-100" />
            <p className="text-[#A7A7A7] sm:text-white text-sm font-normal sm:text-xl">+1 (604)-688-8881</p>
          </div>
        </div>
      </div>

      {/* 하단 구분선 */}
      <hr className="hidden sm:block border-t-2 border-white w-full mt-16" />
      <div className="hidden sm:block sm:flex justify-between sm:px-28 text-white text-2xl pt-6">
        <p>Lina's Deli</p>
        <div>
          <a href="https://www.instagram.com/linasdeli/"
            className="hover:bg-gray-400 transition">
            <img src="/Icon/Icon_instagram.svg" alt="Instagram Icon"
              className="w-7 h-7 sm:filter sm:invert sm:brightness-0 sm:contrast-100" />
          </a>
        </div>
      </div>
    </div>

  );
};

export default Footer;