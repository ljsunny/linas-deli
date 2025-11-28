import { useParams } from "react-router-dom";
import OrderForm from "./OrderForm";
import petiteBox from "@/assets/home/order/board1.jpeg";
import mediumBox from "@/assets/home/order/board2.jpeg";
import largeBox from "@/assets/home/order/board3.jpeg";
import PageBanner from "@/components/PageBanner";

const boxData = {
    PETITE: {
        image: petiteBox,
        serves: "Serves 3-4 people",
        description: "3 types of charcuterie\n3 types of cheeses\nJam/ Nuts, fresh or dried fruit",
        price: 70,
    },
    MEDIUM: {
        image: mediumBox,
        serves: "Serves 4-5 people",
        description: "4 types of charcuterie\n4 types of cheeses\nJam/ Nuts, fresh or dried fruit",
        price: 85,
    },
    LARGE: {
        image: largeBox,
        serves: "Serves 10-12 people",
        description: "8 types of charcuterie\n8 types of cheeses\nJam/ Nuts, fresh or dried fruit",
        price: 145,
    },
} as const;

const OrderDetail = () => {
    const { boxType } = useParams();
    const normalizedBoxType = boxType?.toUpperCase() as keyof typeof boxData;

    if (!boxData[normalizedBoxType]) {
        return <div className="text-center text-red-500">Invalid Box Type</div>;
    }

    const { image, serves, description, price } = boxData[normalizedBoxType];

    return (
        <div>
            <PageBanner title="Order" />
            <div className="px-5 py-8 lg:flex lg:items-center lg:justify-center lg:min-h-screen lg:gap-[30px] lg:px-20 lg:py-20">

                {/* ✅ 이미지 + 카드 */}
                <div className="relative my-6 max-w-md mx-auto lg:w-1/2 lg:flex-1">
                    <div className="relative w-full h-40 lg:h-full">
                        <img src={image} alt={boxType} className="w-full h-full object-cover rounded-xl brightness-75" />

                        {/* 카드 (이미지 위에 배치) */}
                        <div className="absolute -bottom-2 right-0 bg-white/95 shadow-lg rounded-xl p-4 w-1/2 h-2/3 text-center flex flex-col items-center justify-center gap-2
                        lg:w-full lg:h-1/2 lg:gap-3">
                            <h3 className="text-base font-bold lg:text-2xl">{boxType} BOX</h3>
                            <p className="text-sm text-gray-600 lg:text-xl">{serves}</p>
                            <p className="text-sm font-semibold text-[#AD343E] lg:text-xl">
                                ${price} <span className="text-sm text-gray-500 lg:text-xl">+ tax</span>
                            </p>
                            <p className="hidden lg:block text-gray-400 lg:text-base whitespace-pre-line">{description}</p>
                        </div>
                    </div>
                </div>

                {/* ✅ 주문 폼 */}
                <div className="max-w-md mx-auto lg:max-w-2xl lg:w-1/2 lg:border lg:p-5 lg:rounded-3xl lg:border-gray-200 lg:shadow-2xl lg:flex-1">
                    <OrderForm />
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;