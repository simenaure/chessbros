import React, { useState } from "react";
import LoginPage from './login.tsx'
import SignUp from './signup.tsx'

const LoginSetup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
/* Switch between LogIN Page and SignUP Page*/ 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isLogin ? (
        <LoginPage />
      ) : (
        <SignUp />
      )}
      <button
        className="absolute bottom-4 bg-gray-200 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-300 transition"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Go to Sign Up" : "Back to Login"}
      </button>
    </div>
  );
};

export default LoginSetup;
