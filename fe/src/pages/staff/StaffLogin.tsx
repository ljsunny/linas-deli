import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/api/axios";
import { AxiosError } from "axios";

const StaffLogin = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = new URLSearchParams({ id, password });
      const response = await api.post(
        "/api/auth/login",
        requestData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // 여기서만 수정
          },
          withCredentials: true,
        }
      );

      // console.log(response);
      // console.log(import.meta.env.VITE_API_BASE_URL);

      if (response.status === 200 && response.data.user) {
        const { user } = response.data;

        localStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("sessionId", user.sessionId);

        navigate(user.role === "ROLE_STAFF" ? "/staff/order" : "/staff/login");

        setId("");
        setPassword("");
      } else {
        toast.error("로그인 정보가 올바르지 않습니다.");
      }
    } catch (error: unknown) {
      console.error("로그인 에러:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "네트워크 오류가 발생했습니다.");
      } else {
        toast.error("예기치 못한 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/Banner/banner1.jpeg)' }}>
      {/* 검은색 투명 레이어 (rgba 사용) */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>
        <div className="bg-transparent p-8 rounded-lg w-full sm:w-[530px] z-100">
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-[97.5px] font-bold text-white">Lina's Deli</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <div className="flex items-center border border-white rounded-lg overflow-hidden">
              <span className="p-3 text-white"><img src="/Icon/icon_user.png" alt="User" /></span>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="USERNAME"
                required
                disabled={loading}
                className="w-full px-4 py-2 border-none outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white"
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border border-white rounded-lg overflow-hidden">
              <span className="p-3 text-white"><img src="/Icon/icon_lock.png" alt="Lock" /></span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                required
                disabled={loading}
                className="w-full px-4 py-2 border-none outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-[#AD343E] bg-[#f2f2f2] font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "loading..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>

  );
};

export default StaffLogin;
