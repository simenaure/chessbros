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
  const [gender, setGender] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");

  // Fetch country list from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data
          .map((country: any) => country.name.common)
          .sort();
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

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

          <label className="signup-label">Phone:</label>
          <input
            type="tel"
            className="signup-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
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

          <div className="gender-container">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                className="mr-2"
                onChange={(e) => setGender(e.target.value)}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                className="mr-2"
                onChange={(e) => setGender(e.target.value)}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="other"
                className="mr-2"
                onChange={(e) => setGender(e.target.value)}
              />
              Other
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="prefer-not-to-say"
                className="mr-2"
                onChange={(e) => setGender(e.target.value)}
              />
              Prefer not to share
            </label>
          </div>

          {/* Country Dropdown (Dynamic) */}
          {/*<div className="mb-4 text-left">
            <label className="block text-gray-600 text-sm mb-2">Country:</label>*/}
          <select
            className="signup-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select your country</option>
            {countries.map((countryName, index) => (
              <option key={index} value={countryName}>
                {countryName}
              </option>
            ))}
          </select>

          <label className="signup-label">Address:</label>
          <input
            type="text"
            className="signup-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />

          <label className="signup-label">Zip:</label>
          <input
            type="zip"
            className="signup-input"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Zip Code"
          />

          <label className="signup-label">City:</label>
          <input
            type="text"
            className="signup-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
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
