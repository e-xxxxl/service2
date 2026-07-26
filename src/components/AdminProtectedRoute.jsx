// components/admin/AdminProtectedRoute.jsx - Check admin token key
import { Navigate } from "react-router-dom";

export function AdminProtectedRoute({ children }) {
  // ✅ Check admin-specific token
  const token = localStorage.getItem("adminAuthToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.accountType === "admin" && payload.exp * 1000 > Date.now()) {
      return children;
    }
  } catch (e) {}

  localStorage.removeItem("adminAuthToken");
  return <Navigate to="/admin/login" replace />;
}