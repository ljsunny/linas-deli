import { Supplier } from "@/type";

type Props = {
  supplier: Supplier;
  onClickEdit: () => void;
};

const StaffSupplierRow = ({ supplier, onClickEdit }: Props) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-5 gap-y-2 md:gap-y-0 text-center font-medium bg-white mb-6 py-4 px-3 rounded shadow-sm cursor-pointer hover:bg-gray-50"
      onClick={onClickEdit}
    >
      <div>#{supplier.sid}</div>
      <div>{supplier.supplierName}</div>
      <div>{supplier.contactName}</div>
      <div>{supplier.sEmail}</div>
      <div>{supplier.sPhone}</div>
    </div>
  );
};

export default StaffSupplierRow;