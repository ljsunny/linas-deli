import { useEffect, useState } from "react";
import StaffPageBanner from "@/components/staff/StaffPageBanner";
import { Supplier } from "@/type";
import api from "@/api/axios";
import Pagination from "@/components/Pagination";
import StaffSupplierRow from "@/components/staff/supplier/StaffSupplierRow";
import StaffSupplierForm from "@/components/staff/supplier/StaffSupplierForm";

const StaffSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage - 1,
        size: 10,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/api/staff/suppliers?${queryString}`);
      setSuppliers(response.data.suppliers.content);
      setTotalPages(response.data.suppliers.totalPages);
    } catch (err) {
      if (err instanceof Error) setError("Error fetching data: " + err.message);
      else setError("Unknown error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSaveSupplier = async (supplier: Supplier) => {
    try {
      if (supplier.sid) {
        // 수정
        await api.put(`/api/staff/suppliers/${supplier.sid}`, supplier);
      } else {
        // 등록
        await api.post(`/api/staff/suppliers`, supplier);
      }
      fetchSuppliers();
    } catch (e) {
      console.error(e);
      alert("Error saving supplier");
    }
  };

  const handleDeleteSupplier = async (supplierId: number) => {
  try {
    await api.delete(`/api/staff/suppliers/${supplierId}`);
    fetchSuppliers();
  } catch (e) {
    console.error(e);
    alert("Failed to delete supplier.");
  }
};

  return (
    <>
      <div className="bg-[#C3E2C6] min-h-screen">
        <StaffPageBanner title="Suppliers" />
        <div className="max-w-6xl mx-auto overflow-hidden py-16 px-2">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setSelectedSupplier(null);
                setIsFormOpen(true);
              }}
              className="bg-[#AD343E] text-white px-4 py-2 rounded text-sm"
            >
              Add Supplier
            </button>
          </div>

          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}

          <div className="hidden md:flex w-full border-[#525252] border-t border-b my-3 font-bold text-base py-2">
            <div className="w-[20%] text-center">Supplier No.</div>
            <div className="w-[20%] text-center">Supplier Name</div>
            <div className="w-[20%] text-center">Contact Name</div>
            <div className="w-[20%] text-center">Email</div>
            <div className="w-[20%] text-center">Phone num</div>
          </div>

          <div className="w-full border-collapse">
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <StaffSupplierRow
                  key={supplier.sid}
                  supplier={supplier}
                  onClickEdit={() => {
                    setSelectedSupplier(supplier);
                    setIsFormOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="w-full text-center py-4 text-gray-500">
                No data
              </div>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <StaffSupplierForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveSupplier}
        onDelete={handleDeleteSupplier}
        initialData={selectedSupplier}
      />
    </>
  );
};

export default StaffSuppliers;