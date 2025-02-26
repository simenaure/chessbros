import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Users from "./pages/databasepage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Users />
  </StrictMode>
);
