import instaLogo from "@/assets/home/instagram/instagram_logo.png";
import img1 from "@/assets/home/instagram/instagram1.png";
import img2 from "@/assets/home/instagram/instagram2.png";
import img3 from "@/assets/home/instagram/instagram3.png";
import img4 from "@/assets/home/instagram/instagram4.png";
import img5 from "@/assets/home/instagram/instagram5.png";
import img6 from "@/assets/home/instagram/instagram6.png";
import img7 from "@/assets/home/instagram/instagram7.png";

const instagramPosts = [
    { img: img1, link: "https://www.instagram.com/p/DAB2YSqyWBC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { img: img2, link: "https://www.instagram.com/p/C_7NrJyx50o/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { img: img3, link: "https://www.instagram.com/p/C_Rg6nZSIq1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { img: img4, link: "https://www.instagram.com/p/C-y_FVZRG5Y/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { img: img5, link: "https://www.instagram.com/p/C-WKGgiyi7-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { img: img6, link: "https://www.instagram.com/p/C8wu50_RVJF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
];

const instagramPostsLg = [
    ...instagramPosts,
    { img: img7, link: "https://www.instagram.com/p/C8JAwY0RNZ8/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    
];

const InstagramSection = () => {
    return (
        <section className="px-6 py-12 sm:py-20 bg-gray-100">
            {/* 인스타그램 제목 & 로고 */}
            <div className="text-center mb-8 sm:mb-12 lg:hidden">
                <img src={instaLogo} alt="Instagram Logo" className="w-[4rem] h-[4rem] mx-auto mb-2 sm:w-16 sm:h-16" />
                <a 
                    href="https://www.instagram.com/linasdeli/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-black text-center font-pretendard text-[0.875rem] font-light tracking-[-0.0175rem]"
                >
                    https://www.instagram.com/linasdeli/
                </a>
            </div>

            {/* 📱 모바일(2x3) & 🖥 태블릿(3x2) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-4 sm:gap-6 px-2 sm:px-10">
                {instagramPosts.map((post, index) => (
                    <a key={index} href={post.link} target="_blank" rel="noopener noreferrer">
                        <img src={post.img} alt={`Instagram Image ${index + 1}`} className=" object-cover w-full aspect-square" />
                    </a>
                ))}
            </div>

            {/* 💻 데스크탑(lg) → 4x2 구조 (첫 번째 칸: 인스타 로고) */}
            <div className="hidden lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-5 lg:px-[5.0rem]">
                {/* 첫 번째 칸 (Instagram 로고) */}
                <div className="flex flex-col items-center justify-center">
                    <img src={instaLogo} alt="Instagram Logo" className="w-[6rem] h-[6rem] mb-2" />
                    <a 
                        href="https://www.instagram.com/linasdeli/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-black text-center font-pretendard text-sm font-light tracking-[-0.0175rem] hover:underline"
                    >
                        https://www.instagram.com/<br></br>linasdeli/
                    </a>
                </div>

                {instagramPostsLg.map((post, index) => (
                    <a key={index} href={post.link} target="_blank" rel="noopener noreferrer">
                        <img src={post.img} alt={`Instagram Image ${index + 1}`} className=" object-cover w-full aspect-square" />
                    </a>
                ))}
            </div>
        </section>
    );
};

export default InstagramSection;