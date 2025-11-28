type StatusItem = {
  status: string;
  count: number;
};

type StaffOrderStatusProps = {
  item: StatusItem;
  index: number;
  selectedStatus: string;
  searchByStatus: (status: string) => void;
};

const StaffOrderStatus = ({
  item,
  index,
  selectedStatus,
  searchByStatus,
}: StaffOrderStatusProps) => {
  const isSelected = selectedStatus === item.status;

  return (
    <div
      key={index}
      className={`cursor-pointer border-b-4 ${
        isSelected ? "border-[#AD343E] text-[#AD343E]" : "border-transparent"
      } 
      flex flex-col justify-center items-center md:flex-row pb-2 md:ml-8 md:pb-4 md:pb-3`}
      onClick={() => searchByStatus(item.status)}
    >
      <span className="text-base font-semibold">{item.status}</span>
      <span
        className={`mt-2 md:mt-0 md:ml-3 text-white font-semibold rounded-[7.5px] 
        flex items-center justify-center 
        w-8 h- md:w-8 md:h-8 
        ${isSelected ? "bg-[#AD343E]" : "bg-[#878787]"}`}
      >
        {item.count}
      </span>
    </div>
  );
};

export default StaffOrderStatus;
