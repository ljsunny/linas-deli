import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
import { MenuItem } from "@/type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
}

const MenuModal = ({ isOpen, onClose, menuItem }: Props) => {
  if (!menuItem) return null;

  const renderAllergyMarks = () => {
    if (!menuItem.allergies || menuItem.allergies.length === 0) return null;

    return (
      <div className="flex items-center gap-2 mt-2">
        {menuItem.allergies.includes("G") && (
          <div className="flex items-center gap-1">
            <img src="/Icon/allergy/icon_glutenfree.png" alt="GlutenFree" className="w-6 h-6" />
            <span className="text-sm text-gray-600 hidden lg:block">Gluten Free</span>
          </div>
        )}
        {menuItem.allergies.includes("L") && (
          <div className="flex items-center gap-1">
            <img src="/Icon/allergy/icon_lactosefree.png" alt="LactoseFree" className="w-6 h-6" />
            <span className="text-sm text-gray-600 hidden lg:block">Lactose Free</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <Dialog.Title className="text-xl font-bold flex items-center gap-3">
                  <span>{menuItem.productName}</span>

                  {/* ✅ Others가 아닐 때만 국기 표시 */}
                  {menuItem.categoryName !== "Others" && (
                    <img
                      src={`/Icon/flag/flag_${menuItem.countryName}.png`}
                      alt={menuItem.countryName}
                      className="w-6 h-4 object-cover shadow-sm"
                    />
                  )}

                  {renderAllergyMarks()}
                </Dialog.Title>

                <button onClick={onClose} className="text-gray-500 hover:text-black">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col lg:flex-row gap-6 p-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1 underline">Description</h3>
                    <p className="text-gray-800 whitespace-pre-line">{menuItem.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1 underline">Serving Suggestion</h3>
                    <p className="text-gray-700 whitespace-pre-line">{menuItem.servingSuggestion}</p>
                  </div>

                  {/* ✅ Others 제외한 경우에만 Details 출력 */}
                  {menuItem.categoryName !== "Others" && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1 underline">Details</h3>
                      <p className="text-gray-700">
                        {menuItem.categoryName === "Meat"
                          ? `${menuItem.animalName} meat`
                          : menuItem.categoryName === "Bulk"
                            ? `${menuItem.animalName}`
                            : `${menuItem.pasteurized ? "Pasteurized" : "Unpasteurized"}, ${menuItem.animalName} milk`}
                      </p>
                    </div>
                  )}
                </div>

                {/* 재료 이미지 */}
                {menuItem.ingredientsImageUrl && (
                  <div className="flex-1">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${menuItem.ingredientsImageUrl}`}
                      alt="Ingredient"
                      className="w-full h-auto rounded-lg border object-contain shadow"
                    />
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MenuModal;