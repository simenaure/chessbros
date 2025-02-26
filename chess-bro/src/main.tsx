<<<<<<< HEAD
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Users from "./pages/databasepage";
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginSetup from './login/logintosignup.tsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import FrontPage from './pages/FrontPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Layout from './pages/Layout.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <FrontPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />
      },
      {
        path: '/login',
        element: <LoginSetup />
      }
    ],
    errorElement: <ErrorPage />
  }
]);
>>>>>>> 3c379c23cf567cc01ebf0844be963294a2e40b1d

createRoot(document.getElementById("root")!).render(
  <StrictMode>
<<<<<<< HEAD
    <Users />
  </StrictMode>
);
=======
    <RouterProvider router={router} />
  </StrictMode>
)
>>>>>>> 3c379c23cf567cc01ebf0844be963294a2e40b1d
