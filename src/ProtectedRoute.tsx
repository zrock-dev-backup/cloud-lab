import React, { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
