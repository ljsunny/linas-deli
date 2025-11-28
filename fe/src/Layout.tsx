import { ReactNode } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { useAuth } from "./auth/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StaffNavbar from "./components/staff/StaffNavbar";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import NotFound from "./pages/Notfound";
import Gallery from "./pages/OrderGarllery";

import StaffLogin from "./pages/staff/StaffLogin";
import StaffMenu from "./pages/staff/StaffMenu";
import StaffOrderHistory from "./pages/staff/StaffOrderHistory";
import StaffMyInfo from "./pages/staff/StaffMyInfo";
import StaffSuppliers from "./pages/staff/StaffSuppliers";
import StaffAddMenuForm from "./pages/staff/menu/StaffAddMenuForm";
import StaffUpdateMenuForm from "./pages/staff/menu/StaffUpdateMenuForm";

import OrderDetail from "./sections/order/OrderDetail";
import SuccessPage from "./sections/order/SuccessPage";
import CancelPage from "./sections/order/CancelPage";
import DonationSuccess from "./sections/order/DomationSuccess";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!user) {
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const PublicShell = () => (
  <>
    <Navbar />
    <main className="w-full pt-0 text-base">
      <Outlet />
    </main>
    <Footer />
  </>
);

const StaffShell = () => (
  <>
    <StaffNavbar />
    <main className="w-full bg-[#F7F3EA] pt-0 text-base">
      <Outlet />
    </main>
  </>
);

const Layout = () => (
  <Routes>
    <Route element={<PublicShell />}>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/order" element={<Order />} />
      <Route path="/order/:boxType" element={<OrderDetail />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />
      <Route path="/donation-success" element={<DonationSuccess />} />
    </Route>

    <Route path="/staff/login" element={<StaffLogin />} />

    <Route element={<StaffShell />}>
      <Route
        path="/staff/menu"
        element={
          <RequireAuth>
            <StaffMenu />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/add-menu"
        element={
          <RequireAuth>
            <StaffAddMenuForm />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/update-menu"
        element={
          <RequireAuth>
            <StaffUpdateMenuForm />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/order"
        element={
          <RequireAuth>
            <StaffOrderHistory />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/mypage"
        element={
          <RequireAuth>
            <StaffMyInfo />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/suppliers"
        element={
          <RequireAuth>
            <StaffSuppliers />
          </RequireAuth>
        }
      />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const Spinner = () => (
  <div className="spinner">
    <div className="spinner__circle" />
  </div>
);

export default Layout;
