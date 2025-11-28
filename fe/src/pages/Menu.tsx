import { useState, useEffect } from "react";
import MenuCategory from "@/components/menu/MenuCategory";
import MenuRow from "@/components/menu/MenuRow";
import MenuModal from "@/components/menu/MenuModal";
import PageBanner from "@/components/PageBanner";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination"; // 추가된 부분

import { MenuItem } from "@/type";
import api from "@/api/axios";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // 0-based for Spring
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

  const fetchProducts = async (category: string, search: string, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl =
        category === "All"
          ? `/api/products?keyword=${encodeURIComponent(search)}`
          : `/api/products?category=${encodeURIComponent(category)}&keyword=${encodeURIComponent(search)}`;
      const fullUrl = `${baseUrl}&page=${page}&size=6`; // page는 0-based, size는 한 페이지당 6개
      const response = await api.get(fullUrl);

      setProductDetails(response.data.content);
      setTotalPages(response.data.totalPages); // 총 페이지 수 저장
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0); // 새 카테고리 선택 시 페이지 초기화
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(0); // 검색 시에도 페이지 초기화
  };

  const handleOpen = (item: MenuItem) => {
    setSelectedMenu(item);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchProducts(selectedCategory, searchTerm, currentPage);
  }, [selectedCategory, searchTerm, currentPage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-[#FFFAEF]">
      <PageBanner title="Menu" />
      <div className="container mx-auto flex flex-col lg:flex-row">
        <MenuCategory 
          onCategoryChange={handleCategoryChange} 
          selectedCategory={selectedCategory} 
        />
        <div className="lg:ml-15 my-2 lg:my-10 w-full">
          <SearchBar onSearch={handleSearch} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mt-[30px]">
            {productDetails.map((item, index) => (
              <MenuRow 
                key={item.pid} 
                item={item} 
                handleOpen={handleOpen} 
                index={index}
                // delay={index * 0.1}
              />
            ))}
          </div>

          {/* Pagination 컴포넌트 */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage + 1} // 1-based로 보여주기
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page - 1)} // 클릭 시 0-based로 변환
            />
          </div>
        </div>
      </div>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuItem={selectedMenu}
      />
    </div>
  );
};

export default Menu;