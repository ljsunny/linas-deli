import api from "@/api/axios";
import React from "react";

interface StaffAddPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const StaffAddPromoModal: React.FC<StaffAddPromoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
  
    try {
      await api.post("/api/staff/promotions", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ 헤더 명시
        },
      });
      alert("Promotion added!");
      onClose();
      onSuccess(); // 목록 새로고침
    } catch (err) {
      alert("Failed to add promotion");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] space-y-4 relative">
        <h2 className="text-xl font-semibold text-center">Add Promotion</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              name="promotionTitle"
              type="text"
              placeholder="Enter promotion title"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Start Date</label>
            <input name="startDate" type="date" required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">End Date</label>
            <input name="endDate" type="date" required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Image (optional)</label>
            <input name="image" type="file" accept="image/*" className="w-full" />
            <br/><span className="text-sm text-red-600">⦿ Modal Aspect Ratio: 800×600px (4:3 ratio)</span>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#8E5927] text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffAddPromoModal;