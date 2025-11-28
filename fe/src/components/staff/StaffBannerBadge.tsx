interface StaffPageBannerProps {
  title: string;
}

const StaffBannerBadge = ({ title }: StaffPageBannerProps) => {
  return (
    <div className="w-[213px] bg-transparent rounded-t-[19px] bg-white mx-auto">
      <div className="w-full px-4 py-2 text-sm font-medium text-[#868686] flex justify-center">
        <span>Home {" >"} {title}</span>
      </div>
    </div>
  );
}

export default StaffBannerBadge;
