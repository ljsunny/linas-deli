import board1 from "@/assets/home/order/board1.jpeg";
import board2 from "@/assets/home/order/board2.jpeg";
import board3 from "@/assets/home/order/board3.jpeg";
import board4 from "@/assets/home/order/board4.jpeg";
import board5 from "@/assets/home/order/board5.jpeg";
import board6 from "@/assets/home/order/board6.jpeg";
import { Link } from "react-router-dom";

const OrderSection = () => {
    return (
        <div className="px-6 py-[60px] lg:px-[7.0rem] lg:py-[9.0rem]">
            {/* 섹션 제목 */}
            <div className="relative mb-6 lg:mb-16">
                {/* 버튼 */}
                <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2">
                    <Link to="/order">
                        <img src="/Icon/Outline/arrow_right.svg" alt="Arrow Icon" className="w-5 h-5 lg:w-[3.5rem] lg:h-[3.5rem]" />
                    </Link>
                </button>
                {/* 제목 & 부제목 중앙 정렬 */}
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-xl font-semibold lg:text-4xl">Place an order</h2>
                    <p className="text-gray-500 text-xs lg:text-base mt-4">CHARCUTERIE BOARD</p>
                </div>
            </div>

            {/* 이미지 그리드 */}
            <div className="flex w-full gap-3 lg:gap-4">
                {/* 첫 번째 컬럼 */}
                <div className="flex flex-col gap-2 w-1/3">
                    <img src={board1} alt="Board 1" className="lg:hidden rounded-xl object-cover h-[110px] " />
                    <img src={board2} alt="Board 2" className="rounded-xl object-cover h-[150px] lg:h-[33rem]" />
                </div>

                {/* 두 번째 컬럼 */}
                <div className="flex flex-col gap-2 w-1/3">
                    <img src={board3} alt="Board 3" className="rounded-xl object-cover h-[150px] lg:h-[33rem]" />
                    <img src={board4} alt="Board 4" className="lg:hidden rounded-xl object-cover h-[110px]" />
                </div>

                {/* 세 번째 컬럼 */}
                <div className="flex flex-col gap-2 w-1/3">
                    <img src={board5} alt="Board 5" className="lg:hidden rounded-xl object-cover h-[110px]" />
                    <img src={board6} alt="Board 6" className="rounded-xl object-cover h-[150px] lg:h-[33rem]" />
                </div>
            </div>
        </div>
    );
};

export default OrderSection;