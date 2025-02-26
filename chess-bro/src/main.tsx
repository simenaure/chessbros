import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginSetup from "./login/logintosignup.tsx";
import Front from "./Front_page/Front.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Front />
    <LoginSetup />
  </StrictMode>
);
