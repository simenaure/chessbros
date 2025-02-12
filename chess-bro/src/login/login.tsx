import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", email, password);

  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
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
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
       
      </div>
    </div>
    );

    
};      
export default LoginPage;
 
 
