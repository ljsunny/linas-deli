import StaffBannerBadge from "./StaffBannerBadge";

interface StaffPageBannerProps {
    title: string;
  }
  
  const StaffPageBanner = ({ title }: StaffPageBannerProps) => {
    return (
        <div>
            <section className="relative w-full h-[380px] lg:h-[360px] flex items-center lg:justify-start justify-center text-center overflow-hidden">
                {/* 배경 이미지 */}
                <div className="absolute inset-0 rounded-b-4xl lg:rounded-b-none overflow-hidden">
                    <img
                        src="/Banner/banner1.jpeg"
                        alt="Lina's Deli"
                        className="w-full h-full object-cover"
                    />
                    {/* 어두운 오버레이 */}
                    <div className="absolute inset-0 bg-black/60 lg:bg-black/40"></div>
                </div>

                {/* 텍스트 콘텐츠 */}
                <div className="relative z-10 text-white mt-15 lg:mt-2 p-7 lg:p-20 lg:ps-40">
                    <h1 className="text-3xl sm:text-5xl font-bold lg:hidden">Lina’s Deli</h1>
                    <h1 className="hidden lg:block text-7xl font-semibold">{title}</h1>
                    <p className="lg:hidden mt-4 text-base sm:text-lg">
                        At Lina’s, everyone is family, and you’ll find the friendliest service in the city.
                    </p>
                </div>

                {/* Sticky Breadcrumb Badge */}
                <div className="absolute bottom-0 right-30 z-20 bg-transparent px-4">
                    <StaffBannerBadge title={title}/>
                </div>
            </section>
        </div>
    );
};

export default StaffPageBanner;