import Popup from "../Components/popups.tsx";
import React, { useState, useEffect } from "react";
import "./signup.css";

interface SignupPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUp: React.FC<SignupPageProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    console.log("Redirecting to signup...");
    // Add sign-up logic or navigation here
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="signup-overlay">
        <div className="signup-box">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <h2 className="signup-title">Sign Up</h2>

          <label className="signup-label">Name:</label>
          <input
            type="text"
            className="signup-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />

          <label className="signup-label">Email:</label>
          <input
            type="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <label className="signup-label">Password:</label>
          <input
            type="password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <label className="signup-label">Repeat password:</label>
          <input
            type="password"
            className="signup-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Password"
          />

          <button onClick={handleSignup} className="signup-button">
            Sign Up
          </button>
        </div>
      </div>
    </Popup>
  );
};
export default SignUp;
