import { useState } from "react";
import StaffMyInfoSidebar from "@/components/staff/StaffMyInfoSidebar";
import StaffPromotionList from "./StaffPromotionList";
import api from "@/api/axios";

function StaffMyInfo() {

  const [selectedTab, setSelectedTab] = useState("profile");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      alert("✅ " + res.data);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert("❌ " + (err.response?.data || "Failed to change password"));
      console.error(err);
    }
  };

  return (
    <div className="bg-[#C3E2C6] min-h-screen">
      <div className="flex flex-col lg:flex-row">
        <StaffMyInfoSidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        {/* 오른쪽 내용 */}
        <div className="w-full px-2 lg:px-10 py-4 lg:py-10 min-h-lvh ">
          {selectedTab === "profile" && (
            <div className="bg-white p-15 rounded-xl shadow-md w-full">
              {/* ✅ 비밀번호 변경 폼 */}
              <form
                onSubmit={handlePasswordChange}
                className="mb-8 border-b pb-8 border-gray-300"
              >
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border px-4 py-2 rounded-3xl bg-[#F6F6F6] text-[#525252]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border px-4 py-2 rounded-3xl bg-[#F6F6F6] text-[#525252]"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>

              {/* ✅ 기존 정보 */}
              <h1 className="text-2xl font-bold mb-8">Information</h1>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-[#525252]" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  defaultValue="linasdeli@gmail.com"
                  className="w-full bg-[#F6F6F6] text-[#525252] px-5 py-2 rounded-3xl"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium text-[#525252]" htmlFor="address">Address</label>
                <input
                  id="address"
                  type="text"
                  defaultValue="1689 Johnston St, Vancouver, BC"
                  className="w-full bg-[#F6F6F6] text-[#525252] px-5 py-2 rounded-3xl"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium text-[#525252]" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  defaultValue="604-688-8881"
                  className="w-full bg-[#F6F6F6] text-[#525252] px-5 py-2 rounded-3xl"
                />
              </div>

              <div className="flex justify-end">
                <button className="bg-[#A73F3F] hover:bg-[#8f3535] text-white px-6 py-2 rounded-lg w-[82px] mt-3">
                  Save
                </button>
              </div>
            </div>
          )}

          {selectedTab === "promotion" && (
            <StaffPromotionList />
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffMyInfo;