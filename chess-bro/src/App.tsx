// App.tsx
import { useState } from "react";
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
import LoginSetup from "./login/logintosignup"; // ✅ Correct!
import { user } from "./login/user";

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleLoginSuccess = (user: user) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
    setIsLogin(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

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
          element: isLogin ? (
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
      <RouterProvider router={router} />
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
