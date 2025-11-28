import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
import { Promotion } from "@/type";
import api from "@/api/axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
  onSuccess: () => void;
}

const StaffEditPromoModal: React.FC<Props> = ({ isOpen, onClose, promotion, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (promotion) {
      setTitle(promotion.promotionTitle);
      setStartDate(promotion.startDate.slice(0, 10));
      setEndDate(promotion.endDate.slice(0, 10));
    }
  }, [promotion]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!promotion) return;

    const formData = new FormData();
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    if (title) formData.append("promotionTitle", title);
    if (image) formData.append("image", image);

    try {
      await api.put(`/api/staff/promotions/${promotion.promotionId}`, formData, {
        withCredentials: true, 
        headers: {
          // Axios automatically sets this when sending FormData, but you can explicitly add it for clarity
          "Content-Type": "multipart/form-data",
        },

      });
      alert("Promotion updated!");
      onClose();
      onSuccess();
    } catch (err) {
      alert("Failed to update promotion");
      console.error(err);
    }
  };

  if (!promotion) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
              <Dialog.Title className="text-lg font-semibold">Edit Promotion</Dialog.Title>
              <button onClick={onClose}><X size={20} /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block mb-1">Title1111</label>
                <input
                  type="text"
                  name="promotionTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Image (optional)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <br/><span className="text-sm text-red-600">⦿ Modal Aspect Ratio: 800×600px (4:3 ratio)</span>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StaffEditPromoModal;