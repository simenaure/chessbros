import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginSetup from "./login/logintosignup.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FrontPage from "./Front_page/Front.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Layout from "./pages/Layout.tsx";
import Users from "./pages/databasepage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <FrontPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/login",
        element: <LoginSetup />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
