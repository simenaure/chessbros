import React, { useState, useEffect } from "react";
import LoginPage from "./login/login"; // Adjust path as needed
import SignUp from "./login/signup";
import ProfilePage from "./pages/profile/ProfilePage";
import "./App.css";

const App: React.FC = () => {
  // Toggle between showing login or signup form
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  // The authenticated user; null means no one is logged in
  const [currentUser, setCurrentUser] = useState<any>(null);

  // This function will be passed to LoginPage as onLoginSuccess
  const handleLoginSuccess = (user: any): void => {
    console.log("Login successful, user:", user);
    setCurrentUser(user);
  };

  // Logout simply clears the current user state
  const handleLogout = (): void => {
    setCurrentUser(null);
  };

  useEffect(() => {
    console.log("Current user state:", currentUser);
  }, [currentUser]);

  return (
    <div className="app-container">
      {currentUser ? (
        // If logged in, display the profile page and logout button
        <div>
          <ProfilePage user={currentUser} />
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        // If not logged in, display the login/signup forms with a toggle button
        <div className="auth-container">
          {isLoginOpen ? (
            <LoginPage
              isOpen={true}
              onClose={() => setIsLoginOpen(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <SignUp isOpen={true} onClose={() => setIsLoginOpen(true)} />
          )}
          <button onClick={() => setIsLoginOpen(!isLoginOpen)}>
            {isLoginOpen ? "Switch to Sign Up" : "Switch to Login"}
          </button>
          <p>Please log in to view your profile.</p>
        </div>
      )}
    </div>
  );
};

export default App;
