import { useEffect, useState } from "react";
import { Supplier } from "@/type";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  onDelete: (supplierId: number) => void;
  initialData?: Supplier | null;
};

const StaffSupplierForm = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
}: Props) => {
  const [formData, setFormData] = useState<Supplier>({
    sid: 0,
    supplierName: "",
    contactName: "",
    sEmail: "",
    sPhone: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        sid: 0,
        supplierName: "",
        contactName: "",
        sEmail: "",
        sPhone: "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      onDelete(formData.sid);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        {/* X button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          {initialData ? "Edit Supplier" : "Add Supplier"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            placeholder="Supplier Name"
            className="border w-full px-2 py-1 rounded"
            required
          />
          <input
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="Contact Name"
            className="border w-full px-2 py-1 rounded"
          />
          <input
            name="sEmail"
            value={formData.sEmail}
            onChange={handleChange}
            placeholder="Email"
            className="border w-full px-2 py-1 rounded"
          />
          <input
            name="sPhone"
            value={formData.sPhone}
            onChange={handleChange}
            placeholder="Phone"
            className="border w-full px-2 py-1 rounded"
          />

          <div className="flex justify-between mt-6">
            {initialData ? (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="bg-[#AD343E] text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffSupplierForm;