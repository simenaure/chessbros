// App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/NavBar"; // Adjust path as needed
import LoginSetup from "./login/login";
import SignupSetup from "./login/signup";
import ProfilePage from "./pages/profile/ProfilePage";
import "./App.css";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLoginSuccess = (user: any): void => {
    console.log("Login successful, user:", user);
    setCurrentUser(user);
    setIsLoginOpen(false);
  };

  const handleLogout = (): void => {
    console.log("Logging out...");
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Pass currentUser and modal handlers to NavBar */}
        <NavBar
          currentUser={currentUser}
          openLoginModal={() => setIsLoginOpen(true)}
          openSignupModal={() => setIsSignupOpen(true)}
          onLogout={handleLogout}
        />

        {/* Display the profile page if logged in */}
        {currentUser ? (
          <ProfilePage user={currentUser} />
        ) : (
          <div className="auth-container">
            <p>Please log in to view your profile.</p>
          </div>
        )}

        {/* Login & Signup Modals */}
        <LoginSetup
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
        <SignupSetup
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
        />
      </div>
    </Router>
  );
};

export default App;
