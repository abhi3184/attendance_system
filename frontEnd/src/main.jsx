import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoaderProvider } from "./context/LoaderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <LoaderProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </LoaderProvider>
  </React.StrictMode>
);
