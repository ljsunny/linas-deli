import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Promotion } from "@/type";

interface Props {
  promotions: Promotion[];
  currentIndex: number;
  // onClose: () => void;
  onNext: () => void;
}

const PromoPopupModal = ({ promotions, currentIndex, onNext }: Props) => {
  const promotion = promotions[currentIndex];

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onNext}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl md:my-4 bg-white rounded-lg shadow-lg overflow-hidden">
            {/* 헤더 */}
            {/* <div className="flex justify-between items-center px-6 py-4 bg-transparent text-white">
              <h3 className="text-lg font-semibold">{promotion.promotionTitle}</h3>
              <button onClick={onNext}>
                <X size={20} />
              </button>
            </div> */}

            {/* 이미지 */}
            {promotion.promotionImageUrl && (
             <img
             src={`${import.meta.env.VITE_API_BASE_URL}${promotion.promotionImageUrl}`}
             alt={promotion.promotionTitle}
             className="w-full object-cover"
           />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PromoPopupModal;