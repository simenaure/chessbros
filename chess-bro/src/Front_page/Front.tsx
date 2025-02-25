import chessBroLogo from "../assets/chess-kopi.jpg";
import "./Front.css";
import { FaSignInAlt, FaUserPlus, FaMapMarkerAlt } from "react-icons/fa";
import chessGif from "../assets/chess-gif.gif";

function front() {
  return (
    <div className="front-container">
      {/* Picture*/}
      <img src={chessBroLogo} alt="chessBroLogo" className="logo-img" />

      {/* Login Button */}
      <div className="login-container">
        <button className="btn">
          <FaSignInAlt className="btn-icon" />
          Login
        </button>
        <button className="btn">
          <FaUserPlus className="btn-icon" />
          Sign Up
        </button>
      </div>

      {/* text*/}
      <h1 style={{ color: "black" }}> Welcome to chess brothers!</h1>
      <p style={{ color: "black" }}>
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
  );
}

export default front;
