import * as React from "react";

const categories = ["All", "Meat", "Cheese", "Others", "Bulk"];

interface MenuCategoryProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string; // Added selectedCategory prop
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ onCategoryChange, selectedCategory }) => {
  // Handle category selection
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);  // Pass the selected category to the parent
  };

  return (
    <>
      {/* Mobile View */}
      <div className="flex lg:hidden flex-col w-80 mx-auto mt-[50px]">
        <h2 className="text-center text-xl font-semibold">Categories</h2>
        <ul className="flex justify-between py-5">
          {categories.map((category) => {
            const isActive = selectedCategory === category; // Use selectedCategory prop

            return (
              <li
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive ? "bg-[#8E5927] text-white" : "bg-transparent text-[#1A202C]"
                }`}
              >
                {category}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col justify-end w-60 h-[400px] bg-[#AD343E] text-white p-6 rounded-b-xl ml-6">
        <h2 className="text-lg font-bold mb-6">Categories</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`flex justify-between items-center py-2 px-4 rounded-full cursor-pointer ${
                selectedCategory === category
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-[#AD343E]"
              }`}
            >
              {category} <span className="ml-2">→</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default MenuCategory;