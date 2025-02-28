import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LoginSetup from "./login/logintosignup.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FrontPage from "./Front_page/Front.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Layout from "./pages/Layout.tsx";
import Users from "./pages/databasepage.tsx";
import MapPage from "./mapstuff/MapPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <FrontPage />
      },
      {
        path: '/profile/:profileId',
        element: <ProfilePage />
      },
      {
        path: "/login",
        element: <LoginSetup />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/map",
        element: <MapPage />,
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
