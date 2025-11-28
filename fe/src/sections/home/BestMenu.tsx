import { useState } from "react";
import { useNavigate } from "react-router-dom";
import popular1 from "@/assets/home/bestmenu/popular1.png";
import popular2 from "@/assets/home/bestmenu/popular2.jpeg";
import popular3 from "@/assets/home/bestmenu/popular3.jpg";
import popular4 from "@/assets/home/bestmenu/popular4.png";
import meat1 from "@/assets/home/bestmenu/meat1.png";
import meat2 from "@/assets/home/bestmenu/meat2.jpg";
import meat3 from "@/assets/home/bestmenu/meat3.png";
import meat4 from "@/assets/home/bestmenu/meat4.jpg";
import cheese1 from "@/assets/home/bestmenu/cheese1.jpg";
import cheese2 from "@/assets/home/bestmenu/cheese2.jpg";
import cheese3 from "@/assets/home/bestmenu/cheese3.jpg";
import cheese4 from "@/assets/home/bestmenu/cheese4.jpg";

const categories = ["Popular", "Meat", "Cheese"];

const menuItems = [
    { id: 1, category: "Popular", img: popular1, name: "Charcuterie Board" },
    { id: 2, category: "Popular", img: popular2, name: "Charcuterie Cup" },
    { id: 3, category: "Popular", img: popular3, name: "Charcuterie Bites" },
    { id: 4, category: "Popular", img: popular4, name: "B.C. Beef Jerky" },
    { id: 5, category: "Meat", img: meat1, name: "B.C. Beef Jerky" },
    { id: 6, category: "Meat", img: meat2, name: "Cranberry Buffalo" },
    { id: 7, category: "Meat", img: meat3, name: "Gouda Bomb" },
    { id: 8, category: "Meat", img: meat4, name: "Lamb Prociutto" },
    { id: 9, category: "Cheese", img: cheese1, name: "Truffle Manchego" },
    { id: 10, category: "Cheese", img: cheese2, name: "Creamy Smoke Bacon Gouda" },
    { id: 11, category: "Cheese", img: cheese3, name: "Cranberry Wensleydale" },
    { id: 12, category: "Cheese", img: cheese4, name: "15 month Comte French" },
];

const BestMenu = () => {
    const [activeTab, setActiveTab] = useState("Popular");
    const navigate = useNavigate();

    return (
        <section className="px-3 lg:px-6 py-12 lg:py-30 lg:bg-[#FAF6ED]">
            {/* 제목 & 부제목 */}
            <div className="lg:text-center mb-6 lg:mb-10">
                <h2 className="lg:text-4xl text-[1.375rem] font-semibold px-3">Most popular Menu</h2>
                <p className="hidden lg:block text-gray-600 text-sm lg:text-base mt-4">
                    Here's a list of the most popular menu items that are often in high demand
                </p>
            </div>

            {/* 카테고리 탭 */}
            <div className="flex justify-center border-b border-gray-300 mb-6 lg:mb-8 lg:justify-evenly lg:px-30">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={`px-3 lg:px-6 lg:pb-2 text-xs lg:text-xl transition-all ${activeTab === category ? "border-b-4 border-black font-semibold" : "text-gray-500"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* 메뉴 카드 리스트 (lg에서는 4열) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 lg:px-15">
                {menuItems
                    .filter((item) => item.category === activeTab)
                    .map((item) => (
                        <div key={item.id}
                            className="flex flex-col rounded-xl overflow-hidden"
                            onClick={() => navigate("/menu")}>
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full aspect-square object-cover rounded-xl"
                            />
                            <div className="mt-3 text-center text-gray-700 text-xs lg:text-lg font-semibold tracking-wide">
                                {item.name}
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
};

export default BestMenu;