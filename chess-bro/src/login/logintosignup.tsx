import React, { useState } from "react";
import LoginPage from './login.tsx'
import SignUp from './signup.tsx'
import '../index.css'; 


  
 

const LoginSetup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
/* Switch between LogIN Page and SignUP Page*/ 
  return (



    <div className="flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative">

</div>

      
        
{isLogin ? <LoginPage /> : <SignUp />}

<button
  className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
  onClick={() => setIsLogin(!isLogin)}
>
  {isLogin ? "Go to Sign Up" : "Back to Login"}
</button>
</div>
  );
};

export default LoginSetup;
