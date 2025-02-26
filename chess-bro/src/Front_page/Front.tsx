import chessBroLogo from "../assets/chess-kopi.jpg";
import "./Front.css";
import { FaSignInAlt, FaUserPlus, FaMapMarkerAlt } from "react-icons/fa";
import chessGif from "../assets/chess-gif.gif";
import { useState } from "react";
import LoginSetup from "../login/login.tsx";
import SignupSetup from "../login/signup.tsx";

const front: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  //}

  //function front() {
  return (
    <>
      <div className="front-container">
        {/* Picture*/}
        <img src={chessBroLogo} alt="chessBroLogo" className="logo-img" />

        {/* Login Button */}
        <div className="login-container">
          <button className="btn" onClick={() => setIsLoginOpen(true)}>
            <FaSignInAlt className="btn-icon" />
            Login
          </button>
          <button className="btn" onClick={() => setIsSignupOpen(true)}>
            <FaUserPlus className="btn-icon" />
            Sign Up
          </button>
        </div>

        {/* text*/}
        <h1 className="welcome-text">Welcome to chess brothers!</h1>
        <p className="welcome-subtext">
          Find your next chess opponent in Trondheim today!
        </p>

        {/* Map Button */}
        <div className="button-container">
          <button className="btn">
            <FaMapMarkerAlt />
            Chess Map
          </button>
        </div>

        {/* chess gif */}
        <img src={chessGif} alt="Chess Gif" className="chess-gif" />
      </div>

      <LoginSetup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupSetup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </>
  );
};

export default front;
