import React, { useState } from "react";
import Popup from "../Components/popups"; // Adjust path as needed
import "./login.css";

export interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Full login response data:", data);
      if (response.ok) {
        alert("Logged in successfully!");
        onLoginSuccess(data.user);
        onClose();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again later.");
    }
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
