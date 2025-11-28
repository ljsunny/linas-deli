type StaffMyInfoSidebarProps = {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
};

function StaffMyInfoSidebar({ selectedTab, setSelectedTab }: StaffMyInfoSidebarProps) {
    return (
        <>
            {/* ✅ 모바일/태블릿용 상단 바 */}
            <h2 className="text-xl lg:hidden font-bold m-6 text-center">My Page</h2>
            <nav className="flex lg:hidden justify-center gap-4 bg-[#AD343E] text-white py-3 rounded-md mb-4">
                <button
                    onClick={() => setSelectedTab("profile")}
                    className={`px-3 py-1 rounded-full transition ${selectedTab === "profile"
                        ? "bg-white text-black font-semibold"
                        : "hover:bg-[#c3515a]"
                        }`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setSelectedTab("promotion")}
                    className={`px-3 py-1 rounded-full transition ${selectedTab === "promotion"
                        ? "bg-white text-black font-semibold"
                        : "hover:bg-[#c3515a]"
                        }`}
                >
                    Promotion
                </button>
            </nav>

            {/* ✅ 데스크탑용 사이드바 */}
            <aside className="hidden lg:flex flex-col justify-end w-60 h-[400px] bg-[#AD343E] text-white p-6 rounded-b-xl ml-6">
                <h2 className="text-xl font-bold mb-6 text-center">My Page</h2>
                <ul className="space-y-2">
                    <li
                        onClick={() => setSelectedTab("profile")}
                        className={`flex justify-between items-center py-2 px-4 rounded-full cursor-pointer transition-all duration-200 ${selectedTab === "profile"
                            ? "bg-white text-black font-semibold"
                            : "hover:bg-[#c3515a]"
                            }`}
                    >
                        Profile
                        <span className="ml-2">→</span>
                    </li>
                    <li
                        onClick={() => setSelectedTab("promotion")}
                        className={`flex justify-between items-center py-2 px-4 rounded-full cursor-pointer transition-all duration-200 ${selectedTab === "promotion"
                            ? "bg-white text-black font-semibold"
                            : "hover:bg-[#c3515a]"
                            }`}
                    >
                        Promotion
                        <span className="ml-2">→</span>
                    </li>
                </ul>
            </aside>
        </>
    );
}

export default StaffMyInfoSidebar;