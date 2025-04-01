import React, { useState } from "react";
import LoginPage from "./login.tsx";
import SignUp from "./signup.tsx";
import "../index.css";

// Correct: LoginSetup is self-contained and does not require external props.
const LoginSetup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Define the onLoginSuccess callback internally.
  const handleLoginSuccess = (user: any) => {
    console.log("Logged in user:", user);
    // Update state or perform navigation as needed.
  };

  return (
    <div className="flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative">
        {isLogin ? (
          <LoginPage
            isOpen={true}
            onClose={() => setIsLogin(false)}
            onLoginSuccess={handleLoginSuccess} // Now provided internally
          />
        ) : (
          <SignUp isOpen={true} onClose={() => setIsLogin(true)} />
        )}
        <button
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Go to Sign Up" : "Back to Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginSetup;
