import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem("accessToken");

  console.log(accessToken);

  if (!accessToken) return <Navigate to="/auth" replace />;
  return children;
}
