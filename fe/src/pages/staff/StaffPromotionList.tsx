import { useEffect, useState } from "react";
import StaffPromoModal from "@/components/staff/StaffPromoModal";
import StaffAddPromoModal from "@/components/staff/StaffAddPromoModal";
import StaffEditPromoModal from "@/components/staff/StaffEditPromoModal";
import { Promotion } from "@/type";
import api from "@/api/axios";


const PromotionList = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>(""); // 입력창 상태 따로 분리
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editTarget, setEditTarget] = useState<Promotion | null>(null); // 수정용
  const [isEditOpen, setIsEditOpen] = useState(false); // 수정 모달 열림 여부

  const fetchPromotions = () => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", (currentPage - 1).toString());
    params.append("size", "10");
    if (search) params.append("keyword", search);

    api
      .get(`/api/staff/promotions?${params.toString()}`)
      .then((res) => {
        const sortedPromotions = res.data.content.sort(
          (a: Promotion, b: Promotion) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setPromotions(sortedPromotions);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching promotions: " + err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPromotions(); // ✅ 분리된 함수 호출
  }, [currentPage, search]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput); // 검색어 반영
    setCurrentPage(1); // 1페이지로 초기화
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this promotion?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/staff/promotions/${id}`);
      fetchPromotions(); // ✅ 서버에서 최신 목록 다시 가져오기
      alert("Promotion deleted successfully!");
    } catch (err) {
      alert("Failed to delete promotion: " + (err as any).message);
      console.error(err);
    }
  };

  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => setCurrentPage(i)}
        className={`px-3 py-1 rounded-3xl ${currentPage === i ? "bg-[#8E5927] text-white" : "bg-white text-black"}`}
      >
        {i}
      </button>
    );
  }

  if (loading) return <p className="text-center text-gray-500">Loading promotions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-[#C3E2C6] min-h-screen">
      <div className="max-w-6xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4">Promotions</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#8E5927] text-white rounded"
          >
            + Add Promotion
          </button>
        </div>

        {/* 🔍 검색창 */}
        <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
          <input
            type="text"
            placeholder="Search promotion title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-3 py-2 border rounded w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#8E5927] text-white rounded"
          >
            Search
          </button>
        </form>

        {/* 📋 테이블 헤더 */}
        <div className="w-full border-[#525252] flex border-t border-b my-3 font-bold text-base py-2 bg-white rounded-t-md">
          <div className="w-[40%] text-center">Title</div>
          <div className="w-[40%] text-center">Date</div>
          <div className="w-[20%] text-center">Delete</div>
        </div>

        {/* 📦 프로모션 리스트 */}
        <div className="w-full">
          {promotions.map((promo) => (
            <div
              key={promo.promotionId}
              className="flex text-center font-medium bg-white mb-4 py-3 rounded-[7.5px] hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedPromo(promo);
                setIsOpen(true);
              }}
            >
              <div className="w-[40%] border-r border-[#ddd]">{promo.promotionTitle}</div>
              <div className="w-[40%] border-r border-[#ddd]">
                {new Date(promo.startDate).toLocaleDateString()} -{" "}
                {new Date(promo.endDate).toLocaleDateString()}
              </div>
              <div className="w-[20%] flex justify-center items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 모달 열림 방지
                    handleDelete(promo.promotionId);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 📎 페이지네이션 버튼 */}
        <div className="flex justify-center space-x-4 mt-6">{paginationButtons}</div>
      </div>

      {/* ✅ 모달 컴포넌트 */}
      <StaffPromoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        promotion={selectedPromo}
        onUpdate={(promo) => {
          setIsOpen(false); // 모달 닫고
          setEditTarget(promo); // 수정 대상 저장
          setIsEditOpen(true);  // 수정 모달 열기
        }}
      />

      <StaffEditPromoModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        promotion={editTarget}
        onSuccess={() => {
          setIsEditOpen(false);
          fetchPromotions(); // ✅ 다시 불러오기
        }}
      />

      {/* add모달 컴포넌트 */}
      <StaffAddPromoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          setCurrentPage(1);
          setSearch("");
          fetchPromotions(); // ✅ 추가 후 다시 불러오기
        }}
      />
    </div>
  );
};

export default PromotionList;
