import { useEffect, useState, useMemo } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { ProductListDTO } from "@/type"; // 백엔드에서 넘겨주는 정확한 타입 정의
import StaffPageBanner from "@/components/staff/StaffPageBanner";
import StaffMenuCategory from "@/components/staff/StaffMenuCategory";
import StaffSearchBar from "@/components/staff/StaffSearchBar";




const StaffMenu = () => {
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState<ProductListDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 백엔드는 0부터 시작
  const [totalPages, setTotalPages] = useState(1);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchKeyword, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const adjustedCategoryId =
        selectedCategory === null || selectedCategory === 0 ? null : selectedCategory;
  
  
      const response = await api.get("/api/staff/products", {
        params: {
          page: currentPage,
          size: 10,
          keyword: searchKeyword,
          categoryId: adjustedCategoryId,
        },
      });
  
      setProductDetails(response.data.productList.content);
      setTotalPages(response.data.productList.totalPages);
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    }
  };

  const handleToggleInStock = async (productId: number, newValue: boolean) => {
    // 1. UI 먼저 변경 (낙관적 업데이트)
    setProductDetails((prev) =>
      prev.map((p) => (p.pid === productId ? { ...p, inStock: newValue } : p))
    );

    try {
      await api.patch(`/api/staff/products/${productId}/instock`, null, {
        params: { inStock: newValue },
      });

      // ✅ fetchProducts()는 굳이 다시 호출하지 말기!
      // 👉 또는 아래처럼 지연 호출도 가능
      // setTimeout(() => fetchProducts(), 300);
    } catch (err) {
      console.error("Failed to update inStock:", err);
      // 2. 실패 시 롤백
      setProductDetails((prev) =>
        prev.map((p) => (p.pid === productId ? { ...p, inStock: !newValue } : p))
      );
    }
  };

  const handleAddClick = () => {
    navigate("/staff/add-menu");
  };

  const handleUpdateClick = (productId: number) => {
    navigate(`/staff/update-menu?id=${productId}`);
  };

  const sortedProductList = useMemo(() => {
    return [...productDetails].sort((a, b) => {
      if (a.inStock === b.inStock) {
        return a.productName.localeCompare(b.productName);
      }
      return a.inStock ? -1 : 1; // inStock이 true인 게 앞으로
    });
  }, [productDetails]);




  return (
    <div className="bg-[#C3E2C6] min-h-screen">
      <StaffPageBanner title="Menu" />
      <div className="flex flex-col lg:flex-row">
        <StaffMenuCategory selected={selectedCategory} onSelect={(categoryId) => setSelectedCategory(categoryId)} />

        {/* Main Content */}
        <main className="flex-1 px-2 lg:px-10 py-4 lg:py-8 min-h-lvh ">
          {/* Search + Add */}
          <div className="flex flex-col mb-6">
            <StaffSearchBar value={searchKeyword} onChange={(value) => setSearchKeyword(value)} />
            <button
              className="bg-[#A73F3F] hover:bg-[#8f3535] px-6 py-2 text-white rounded-lg w-[82px] ml-auto lg:mr-10 mt-3"
              onClick={handleAddClick}
            >
              +Add
            </button>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-12 font-semibold text-sm px-6 py-4 my-4 border-y">
            <span className="col-span-3">Image</span>
            <span className="col-span-5">Product Name</span>
            <span className="col-span-2">PLU</span>
            <span className="col-span-2 text-center">In Stock</span>
          </div>

          {/* Product List */}
          <div className="rounded-lg shadow-sm">
            {sortedProductList.length > 0 ? (
              sortedProductList.map((product) => (
                <div
                  key={product.pid}
                  className="grid grid-cols-12 items-center px-6 py-4 mb-3 bg-white cursor-pointer"
                  onClick={() => handleUpdateClick(product.pid)}
                >
                  <div className="col-span-3">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${product.productImageUrl ?? ""}`}
                      alt={product.productName ?? ""}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  <div className="col-span-5 font-medium">{product.productName}</div>
                  <div className="col-span-2 font-medium">
                    {product.priceType === "U" ? "By Unit" : product.plu}
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="col-span-2 text-center">
                      <input
                        type="checkbox"
                        checked={product.inStock}
                        onClick={(e) => e.stopPropagation()} // ✅ 클릭 자체에서 버블링 막기
                        onChange={(e) => {
                          handleToggleInStock(product.pid, e.target.checked);
                        }}
                        className="w-5 h-5 accent-green-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">No products found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              className="text-xl"
              disabled={currentPage === 0}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`rounded-full w-8 h-8 ${currentPage === i ? "bg-[#6B3E26] text-white" : "bg-gray-200 text-black"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              className="text-xl"
              disabled={currentPage === totalPages - 1}
            >
              →
            </button>
          </div>
        </main>
      </div>
    </div>

  );
};

export default StaffMenu;