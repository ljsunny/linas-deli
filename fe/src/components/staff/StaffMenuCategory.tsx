import React from "react";

const categories = [
  { name: "All", id: null },
  { name: "Meat", id: 1 },
  { name: "Cheese", id: 2 },
  { name: "Others", id: 3 },
  { name: "Bulk", id: 4 },
];

interface Props {
  selected: number | null;
  onSelect: (categoryId: number | null) => void;
}

const StaffMenuCategory: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <>
      {/* 모바일 */}
      <div className="flex lg:hidden flex-col w-80 mx-auto mt-[50px]">
        <h2 className="text-center text-xl font-semibold">Categories</h2>
        <ul className="flex justify-between py-5">
          {categories.map((category) => {
            const isActive = selected === category.id;

            return (
              <li
                key={category.name}
                onClick={() => onSelect(category.id)}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-200`}
                style={{
                  backgroundColor: isActive ? "#8E5927" : "transparent",
                  color: isActive ? "white" : "#1A202C",
                }}
              >
                {category.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 데스크탑 */}
      <aside className="hidden lg:flex flex-col justify-end w-60 h-[400px] bg-[#AD343E] text-white p-6 rounded-b-xl ml-6">
        <h2 className="text-lg font-bold mb-6">Categories</h2>
        <ul className="space-y-2">
          {categories.map((category) => {
            const isActive = selected === category.id;
            return (
              <li
                key={category.name}
                onClick={() => onSelect(category.id)}
                className={`flex justify-between items-center py-2 px-4 rounded-full font-semibold cursor-pointer ${
                  isActive ? "bg-white text-black" : "hover:bg-[#c94c54]"
                }`}
              >
                {category.name} <span className="ml-2">→</span>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default StaffMenuCategory;