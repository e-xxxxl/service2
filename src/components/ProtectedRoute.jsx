// components/ProtectedRoute.jsx - Using localStorage only
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const token = localStorage.getItem("authToken");

  // No token
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    // Check if token is expired
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role restrictions
    if (allowedRoles.length > 0 && !allowedRoles.includes(payload.accountType)) {
      // Redirect to appropriate dashboard
      if (payload.accountType === "provider") {
        return <Navigate to="/provider-dashboard" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch (e) {
    localStorage.removeItem("authToken");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}

export function PublicRoute({ children }) {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      
      if (payload.exp * 1000 > Date.now()) {
        if (payload.accountType === "provider") return <Navigate to="/provider-dashboard" replace />;
        if (payload.accountType === "admin") return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
      }
    } catch (e) {
      // Invalid token
    }
  }

  return children;
}