import chessBroLogo from "../assets/chess-kopi.jpg";
import "./Front.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import chessGif from "../assets/chess-gif.gif";

const front: React.FC = () => {
  //}

  //function front() {
  return (
    <>
      <div className="front-container">
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
    </>
  );
};

export default front;
