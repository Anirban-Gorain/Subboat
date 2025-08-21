import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import { nhost } from "./api/nhost.js";
import { NhostProvider } from "@nhost/react";

const container = document.getElementById("root");
createRoot(container).render(
  <NhostProvider nhost={nhost}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </NhostProvider>
);
