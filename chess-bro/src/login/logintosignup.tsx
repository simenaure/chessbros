// logintosignup.tsx
import React, { useState } from "react";
import LoginPage from "./login";
import SignUp from "./signup";

// ✅ ADD THIS INTERFACE
export interface LoginSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any) => void;
}

const LoginSetup: React.FC<LoginSetupProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return isLogin ? (
    <LoginPage
      isOpen={true}
      onClose={onClose}
      onLoginSuccess={onLoginSuccess}
    />
  ) : (
    <SignUp isOpen={true} onClose={() => setIsLogin(true)} />
  );
};

export default LoginSetup;
