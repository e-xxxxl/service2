// App.jsx - Fixed
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./Pages/HomePage.jsx";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import EmailVerification from "./components/Auth/EmailVerification.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import ProviderDashboard from "./components/Dashboard/ProviderDashboard.jsx";
import AdminLogin from "./components/Auth/AdminLogin.jsx";
import AdminDashboard from "./components/Dashboard/AdminDashboard.jsx";
import AuthCallback from "./Pages/AuthCallback.jsx";
import ProviderSetup from "./components/provider/ProviderSetup.jsx";
import ComingSoon from "./components/Dashboard/ComingSoon.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          {/* Admin Routes - OUTSIDE AuthProvider to prevent token clearing */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* All other routes inside AuthProvider */}
          <Route path="/*" element={
            <AuthProvider>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<ComingSoon />} />

                {/* Auth Routes */}
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<EmailVerification />} />

                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/provider-dashboard" element={<ProviderDashboard />} />

                {/* Callback & Setup */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/provider/setup" element={<ProviderSetup />} />
              </Routes>
            </AuthProvider>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;