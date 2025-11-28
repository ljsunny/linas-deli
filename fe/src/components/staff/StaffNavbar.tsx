import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

const StaffNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionID = sessionStorage.getItem("sessionId");
    // console.log("Session ID:", sessionID); // Log to ensure the session ID exists
    if (sessionID) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const sessionID = sessionStorage.getItem("sessionId");
      const response = await api.post("/api/auth/logout", {}, {
        headers: {
          "Session-ID": sessionID || "",
        },
      });
  
      if (response.status === 200) {
        console.log("Logout successful!");
        localStorage.removeItem("user")
        sessionStorage.removeItem("sessionId");
        setIsLoggedIn(false);
        navigate("/staff/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-[rgba(255,255,255,0.85)] shadow absolute sm:fixed top-0 left-0 w-full z-100 max-w-[120rem] mx-auto">
      <div className="w-full flex h-[3.375rem] justify-end items-center sm:h-auto sm:justify-between sm:items-center sm:px-13 sm:py-6 sm:bg-white">
        <Link to="/staff/order" className="text-2xl font-bold text-gray-900 hidden sm:block">
          Lina's Deli
        </Link>

        <button className="sm:hidden w-12 h-12 text-2xl" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <ul className="hidden sm:flex space-x-6">
          <li><Link to="/staff/menu" className="text-gray-700 hover:text-gray-900 cursor-pointer">Menu</Link></li>
          <li><Link to="/staff/order" className="text-gray-700 hover:text-gray-900 cursor-pointer">Order</Link></li>
          <li><Link to="/staff/mypage" className="text-gray-700 hover:text-gray-900 cursor-pointer">Mypage</Link></li>
          <li><Link to="/staff/suppliers" className="text-gray-700 hover:text-gray-900 cursor-pointer">Supplier</Link></li>
          {isLoggedIn ? (
            <li onClick={handleLogout} className="text-gray-700 hover:text-gray-900 cursor-pointer">Logout</li>
          ) : (
            <li><Link to="/staff/login" className="text-gray-700 hover:text-gray-900 cursor-pointer">Login</Link></li>
          )}
        </ul>
      </div>

      <div className={`fixed inset-0 bg-[rgba(0,0,0,0.3)] transition-opacity duration-300 ${isOpen ? "bg-opacity-20 visible" : "bg-opacity-0 invisible"}`} onClick={() => setIsOpen(false)}></div>

      <div className={`rounded-tl-3xl rounded-bl-3xl lg:hidden fixed top-0 right-0 w-40 h-screen bg-[#AD343E] shadow-lg p-4 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <ul className="flex flex-col space-y-11 pt-11 items-center">
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 mb-4 shadow">
                <img src={Logo} alt="Logo" className="w-full h-full object-cover scale-101" />
              </div>
            </Link>
          </li>
          <li><Link to="/staff/menu" className="text-white hover:text-gray-300 cursor-pointer" onClick={() => setIsOpen(false)}>Menu</Link></li>
          <li><Link to="/staff/order" className="text-white hover:text-gray-300 cursor-pointer" onClick={() => setIsOpen(false)}>Order</Link></li>
          <li><Link to="/staff/mypage" className="text-white hover:text-gray-300 cursor-pointer" onClick={() => setIsOpen(false)}>Mypage</Link></li>
          <li><Link to="/staff/suppliers" className="text-white hover:text-gray-300 cursor-pointer" onClick={() => setIsOpen(false)}>Supplier</Link></li>
          {isLoggedIn ? (
            <li onClick={handleLogout} className="text-white hover:text-gray-300 cursor-pointer">Logout</li>
          ) : (
            <li><Link to="/staff/login" className="text-white hover:text-gray-300 cursor-pointer" onClick={() => setIsOpen(false)}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default StaffNavbar;