import Popup from "../Components/popups";
import React, { useState } from "react";
import "./signup.css";

interface SignupPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUp: React.FC<SignupPageProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (
      !username ||
      !firstName ||
      !lastName ||
      !gender ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          gender,
          email,
          password,
          confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("User registered successfully! You can now log in.");
        // Optionally clear fields here
        setUsername("");
        setFirstName("");
        setLastName("");
        setGender("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        onClose();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="signup-overlay">
        <div className="signup-box">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <h2 className="signup-title">Sign Up</h2>

          <label className="signup-label">Username:</label>
          <input
            type="text"
            className="signup-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <label className="signup-label">First Name:</label>
          <input
            type="text"
            className="signup-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />

          <label className="signup-label">Last Name:</label>
          <input
            type="text"
            className="signup-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />

          <label className="signup-label">Gender:</label>
          <input
            type="text"
            className="signup-input"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Gender"
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

          <label className="signup-label">Repeat Password:</label>
          <input
            type="password"
            className="signup-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat Password"
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
