import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

interface LayoutProps {
  currentUser: any;
  openLoginModal: () => void;
  openSignupModal: () => void;
  onLogout: () => void;
}

export default function Layout({
  currentUser,
  openLoginModal,
  openSignupModal,
  onLogout,
}: LayoutProps) {
  return (
    <>
      <NavBar
        currentUser={currentUser}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
        onLogout={onLogout}
      />
      {/* ✅ This renders child route components */}
      <Outlet />
      <Footer />
    </>
  );
}
