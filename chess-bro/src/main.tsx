import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Profile from './profile/profile.tsx';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginSetup from './login/logintosignup.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Link to = "/profile">Go to profile page</Link>
    </BrowserRouter>
    <LoginSetup />
  </StrictMode>
)
