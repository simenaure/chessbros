import { Link } from "react-router-dom";
import LoginSetup from "../login/login.tsx";
import SignupSetup from "../login/signup.tsx";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import "../Front_page/Front.css";

export default function NavBar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  return (
    <>
      <div>
        <ul className="flex justify-between items-center w-full h-12 bg-gray-300 px-6">
          <div className="flex space-x-2">
            <NavBarButton page="Home" to="/" className="btn" />
            <NavBarButton page="Profile" to="/profile" className="btn" />
            <NavBarButton page="Map" to="/map" className="btn" />
          </div>
          {/* Login & Signup Buttons */}
          <div className="flex space-x-2">
            <button
              className="btn flex items-center px-4 py-2"
              onClick={() => setIsLoginOpen(true)}
            >
              <FaSignInAlt className="btn-icon" />
              Login
            </button>
            <button className="btn" onClick={() => setIsSignupOpen(true)}>
              <FaUserPlus className="btn-icon" />
              Sign Up
            </button>
          </div>
        </ul>
      </div>

      {/* Login & Signup Modals */}
      <LoginSetup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupSetup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </>
  );
}

function NavBarButton({
  page,
  to,
  className = "",
}: {
  page: string;
  to: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`btn flex items-center px-4 py-2 text-center ${className}`}
    >
      {page}
    </Link>
  );
}
