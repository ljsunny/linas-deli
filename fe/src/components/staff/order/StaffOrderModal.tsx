import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import api from "@/api/axios";
import { toast } from "react-toastify";
import { Order } from "@/type";
import axios from 'axios';

type StaffOrderModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  order: Order;
  updateOrder: (updated: Order) => void;
};

const StaffOrderModal = ({
  isOpen,
  setIsOpen,
  order,
  updateOrder,
}: StaffOrderModalProps) => {
  const [formData, setFormData] = useState<Order>(order || ({} as Order));

  useEffect(() => {
    if (order) {
      const formattedTime =
        order.time && order.time.length === 5 ? `${order.time}:00` : order.time;
      setFormData({ ...order, time: formattedTime });
    }
  }, [order]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("📤 Sending formData:", formData);
    try {
      const response = await api.put(
        `/api/staff/orders/${formData.oid}`,
        formData,
      );

      // console.log("Update Success:", response.data);
      updateOrder(response.data);
      setIsOpen(false);
      toast.success("Order status updated!", {
        onClose: () => window.location.reload(), // ✅ 토스트 닫힐 때 새로고침
        autoClose: 1000, // 1초 후 자동 닫힘
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        toast.error("Please check the form for errors.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[140]"
        onClose={() => setIsOpen(false)}
      >
        <div className="fixed inset-0 bg-black/30 bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-5xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center mb-3 bg-[#AD343E] p-7 text-white">
              <Dialog.Title className="text-lg font-semibold">
                Order Information
              </Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="space-y-1 px-7 pb-7 max-h-[70vh] overflow-y-scroll"
              onSubmit={handleSubmit}
            >
              <div className="flex justify-between flex-col md:flex-row">
                <p className="text-xl font-bold text-gray-700">
                  #{formData.oid || ""} - {formData.status || ""}
                </p>
                <p className="text-xl font-bold text-gray-700">
                  7:50 PM, Feb 11
                </p>
              </div>

              <div className="flex flex-col lg:flex-row justify-between">
                <div className="w-full lg:w-[49%]">
                  <label className="pt-3 block text-xl font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full py-4 px-5 border border-[#DBDFD0] rounded-[61px]"
                  />
                </div>
                <div className="w-full lg:w-[49%]">
                  <label className="pt-3 block text-xl font-medium text-gray-700">
                    Time
                  </label>
                  <select
                    name="time"
                    value={formData.time || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full py-4 px-5 border border-[#DBDFD0] rounded-[61px]"
                  >
                    <option value="">Select Time</option>
                    <option value="10:00:00">10:00</option>
                    <option value="10:30:00">10:30</option>
                    <option value="11:00:00">11:00</option>
                    <option value="11:30:00">11:30</option>
                    <option value="12:00:00">12:00</option>
                    <option value="12:30:00">12:30</option>
                    <option value="13:00:00">13:00</option>
                    <option value="13:30:00">13:30</option>
                    <option value="14:00:00">14:00</option>
                    <option value="14:30:00">14:30</option>
                    <option value="15:00:00">15:00</option>
                    <option value="15:30:00">15:30</option>
                    <option value="16:00:00">16:00</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex flex-col justify-between lg:w-[49%]">
                  <div className="w-full">
                    <label className="pt-3 block text-xl font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full py-4 px-5 border border-[#DBDFD0] rounded-[61px]"
                    />
                  </div>
                  <div className="w-full">
                    <label className="pt-3 block text-xl font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full py-4 px-5 border border-[#DBDFD0] rounded-[61px]"
                    />
                  </div>
                  <div className="w-full">
                    <label className="pt-3 block text-xl font-medium text-gray-700">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full py-4 px-5 border border-[#DBDFD0] rounded-[61px]"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full lg:w-[50%] justify-between">
                  <label className="pt-3 block text-xl font-medium text-gray-700">
                    Allergy
                  </label>
                  <textarea
                    rows={3}
                    name="allergy"
                    value={formData.allergy || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full h-full py-4 px-5 border border-[#DBDFD0] rounded-[33px]"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full justify-between">
                <label className="pt-3 block text-xl font-medium text-gray-700">
                  Note
                </label>
                <textarea
                  rows={3}
                  name="message"
                  value={formData.message || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full h-full py-4 px-5 border border-[#DBDFD0] rounded-[33px]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-[30%] mt-3 py-2 bg-[#AD343E] text-white rounded-3xl ml-auto cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StaffOrderModal;
