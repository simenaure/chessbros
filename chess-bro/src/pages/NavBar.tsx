import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import "../Front_page/Front.css";

interface NavBarProps {
  currentUser: any;
  openLoginModal: () => void;
  openSignupModal: () => void;
  onLogout: () => void;
}

export default function NavBar({
  currentUser,
  openLoginModal,
  openSignupModal,
  onLogout,
}: NavBarProps) {
  return (
    <div>
      <ul className="flex justify-between items-center w-full h-12 bg-gray-300 px-6">
        <div className="flex space-x-2">
          <NavBarButton page="Home" to="/" className="btn" />

          {/* Always show a Profile button.
              If logged in, den er en Link til profil-siden;
              hvis ikke, vises en disabled knapp med "Need to log in" */}
          {currentUser ? (
            <NavBarButton
              page="Profile"
              to={`/profile/${currentUser.username}`}
              className="btn"
            />
          ) : (
            <button disabled className="btn flex items-center px-4 py-2">
              Need to log in
            </button>
          )}

          <NavBarButton page="Map" to="/map" className="btn" />
        </div>
        <div className="flex space-x-2">
          {currentUser ? (
            <button
              className="btn flex items-center px-4 py-2"
              onClick={onLogout}
            >
              <FaSignOutAlt className="btn-icon" />
              Logout
            </button>
          ) : (
            <>
              <button
                className="btn flex items-center px-4 py-2"
                onClick={openLoginModal}
              >
                <FaSignInAlt className="btn-icon" />
                Login
              </button>
              <button className="btn" onClick={openSignupModal}>
                <FaUserPlus className="btn-icon" />
                Sign Up
              </button>
            </>
          )}
        </div>
      </ul>
    </div>
  );
}

interface NavBarButtonProps {
  page: string;
  to: string;
  className?: string;
}

// Vanlig knapp som er en Link, brukt når onClick ikke skal settes
function NavBarButton({ page, to, className = "" }: NavBarButtonProps) {
  return (
    <Link to={to} className={`btn flex items-center px-4 py-2 ${className}`}>
      {page}
    </Link>
  );
}
