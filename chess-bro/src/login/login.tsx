import React, { useState } from "react";
import Popup from "../Components/popups.tsx";
import "./login.css";

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", email, password);
  };

  if (!isOpen) return null;

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="login-overlay">
        <div className="login-box">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <h2 className="login-title">Login</h2>
          <div className="mb-4">
            <label className="login-label">Email:</label>
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <label className="login-label">Password:</label>
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
        </div>
      </div>
    </Popup>
  );
};
export default LoginPage;
