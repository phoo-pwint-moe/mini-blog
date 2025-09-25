import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  if (localStorage.getItem("auth") === "true") {
    const auth = true;
    console.log("ProtectedRoute auth:", auth);
    return auth ? children : <Navigate to="/" />;
    
  }
};
export default ProtectedRoute;
