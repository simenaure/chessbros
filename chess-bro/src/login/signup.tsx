
import React, { useState, useEffect } from "react";


const SignUp: React.FC = () => {
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
        const countryNames = data.map((country: any) => country.name.common).sort();
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Name:</label>
          <input
          type="text"
            
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Phone:</label>
          <input
            type="tel"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Email:</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Password:</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Repeat password:</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <div className="mb-4 text-left">
          <label className="block text-gray-600 text-sm mb-2">Gender:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                className="mr-2"
                onChange={(e) => setGender(e.target.value)}
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                className="mr-2"
                onChange={(e) => setGender(e.target.value)}
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="other"
                className="mr-2"
                onChange={(e) => setGender(e.target.value)}
              />
              Other
            </label>
            <label className="flex items-center">
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
        </div>

      
       {/* Country Dropdown (Dynamic) */}
       <div className="mb-4 text-left">
          <label className="block text-gray-600 text-sm mb-2">Country:</label>
          <select
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
        </div>

       
        <div className="mb-4 text-left">
          <label className="block text-gray-600 text-sm mb-2">Address:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Zip:</label>
          <input
            type="zip"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Zip Code"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">City:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
        </div>


        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
    
      </div>
    </div>
    );

    
};      
export default SignUp;
 
 
