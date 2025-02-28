
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
  



 

  const handleSignup = () => {
    console.log("Redirecting to signup...");
    // Add sign-up logic or navigation here
  };
  

  return (
    <div className="flex items-center justify-center bg-gray-900 bg-opacity-50">
  <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative">
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
      </div>
    </div>
    );

    
};      
export default SignUp;
 
 
