import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./app/globals.css";

// Global fetch interceptor for handling 401 Unauthorized (e.g. deleted user accounts or expired sessions)
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    const url = typeof args[0] === "string" ? args[0] : (args[0] as Request).url;
    if (url.includes("/api/")) {
      const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register" || window.location.pathname === "/";
      if (!isAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  }
  return response;
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
