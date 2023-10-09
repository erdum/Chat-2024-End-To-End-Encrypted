import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { CryptoKeyProvider } from "./context/CryptoKeyContext";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <CryptoKeyProvider>
        <App />
      </CryptoKeyProvider>
    </AuthProvider>
  </Router>
);
