import { useState } from "react";

interface SearchBarProps {
  onSearch: (search: string) => void; // The prop to handle the search term
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm); // Trigger the parent function with the search term
  };

  const handleClearInput = () => {
    setSearchTerm("");
    onSearch(""); // Clear the search when the input is cleared
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-full p-2 bg-white shadow-md lg:mx-6">
      <div className="pl-3 pr-2">
        <img className="block w-10 h-10" src="/Icon/icon_search.svg" alt="search icon" />
      </div>
      <input
        type="text"
        className="flex-grow outline-none"
        placeholder="Search"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
      {searchTerm && (
        <button
          className="pr-3 pl-2 focus:outline-none"
          onClick={handleClearInput}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
