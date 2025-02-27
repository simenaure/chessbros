import "./Front.css";
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

        {/* chess gif */}
        <img src={chessGif} alt="Chess Gif" className="chess-gif" />
      </div>
    </>
  );
};

export default front;
