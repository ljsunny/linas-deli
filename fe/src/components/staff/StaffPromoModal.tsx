import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
import { Promotion } from "@/type";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
  onUpdate?: (promotion: Promotion) => void; // ✅ 추가
}

const StaffPromoModal = ({ isOpen, onClose, onUpdate, promotion }: Props) => {
  if (!promotion) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* 배경 */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        {/* 모달 */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
            {/* 헤더 */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#AD343E] text-white">
              <Dialog.Title className="text-lg font-semibold">
                Promotion #{promotion.promotionId}
              </Dialog.Title>
              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* 내용 */}
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                {promotion.promotionTitle}
              </h2>

              {promotion.promotionImageUrl && (
                <img
                src={`${import.meta.env.VITE_API_BASE_URL}${promotion.promotionImageUrl}`}
                alt={promotion.promotionTitle}
                className="w-full h-60 object-cover rounded-md border"
              />
              )}

              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Period:</strong>{" "}
                  {new Date(promotion.startDate).toLocaleDateString()} ~{" "}
                  {new Date(promotion.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(promotion.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {new Date(promotion.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="px-6 py-4 flex justify-end bg-gray-100">
              <button
                onClick={() => onUpdate?.(promotion)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StaffPromoModal;