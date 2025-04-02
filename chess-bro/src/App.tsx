// App.tsx
import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import FrontPage from "./Front_page/Front";
import ProfilePage from "./pages/profile/ProfilePage";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout";
import Users from "./pages/databasepage";
import MapPage from "./mapstuff/MapPage";
import SignupSetup from "./login/signup";
import LoginSetup from "./login/logintosignup";
import { user } from "./login/user";

function App() {
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // ✅ Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  const handleLoginSuccess = (user: user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const isLoggedIn = !!currentUser;

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout
          currentUser={currentUser}
          openLoginModal={() => setIsLoginOpen(true)}
          openSignupModal={() => setIsSignupOpen(true)}
          onLogout={handleLogout}
        />
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <FrontPage />,
        },
        {
          path: "/profile/:profileId",
          element:
            isLoggedIn && currentUser ? (
              <ProfilePage {...currentUser} />
            ) : (
              <Navigate to="/" replace />
            ),
        },
        {
          path: "/map",
          element: <MapPage />,
        },
        {
          path: "/users",
          element: <Users />,
        },
      ],
    },
  ]);

  return (
    <>
      {!loadingUser && <RouterProvider router={router} />}
      <LoginSetup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignupSetup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </>
  );
}

export default App;
