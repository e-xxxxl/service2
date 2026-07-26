// App.jsx - Complete with Protected Routes
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute.jsx";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute.jsx";
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
import PrivacyPolicy from "./components/Legal/PrivacyPolicy.jsx";
import TermsOfService from "./components/Legal/TermsOfService.jsx";
import HomePage from "./Pages/HomePage.jsx";
import AboutUs from "./Pages/AboutUs.jsx";
import FAQ from "./Pages/FAQ.jsx";
import Contact from "./Pages/Contact.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          {/* ================================ */}
          {/* Admin Routes - OUTSIDE AuthProvider */}
          {/* ================================ */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* All other routes inside AuthProvider */}
          {/* ================================ */}
          <Route
            path="/*"
            element={
              <AuthProvider>
                <Routes>
                  {/* ---------- Public Pages ---------- */}
                  {/* <Route path="/" element={<ComingSoon />} /> */}
                  <Route path="/" element={<HomePage/>} />
                  <Route path="/about" element={<AboutUs/>} />
                  <Route path="/faq" element={<FAQ/>} />
                  <Route path="/contact" element={<Contact/>} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />

                  {/* ---------- Auth Routes (redirect if logged in) ---------- */}
                  <Route
                    path="/signup"
                    element={
                      <PublicRoute>
                        <SignUp />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route path="/verify-email" element={<EmailVerification />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* ---------- Customer Dashboard (protected) ---------- */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["customer"]}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* ---------- Provider Dashboard (protected + setup guard) ---------- */}
                  <Route
                    path="/provider-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["provider"]}>
                        <ProviderDashboard/>
                      </ProtectedRoute>
                    }
                  />

                  {/* ---------- Provider Setup (protected, provider only) ---------- */}
                  {/* <Route
                    path="/provider/setup"
                    element={
                      <ProtectedRoute allowedRoles={["provider"]}>
                        <ProviderSetup />
                      </ProtectedRoute>
                    }
                  /> */}

                  {/* ---------- 404 ---------- */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center bg-[#F5F4F0]">
                        <div className="text-center">
                          <h1 className="text-[48px] font-bold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
                            404
                          </h1>
                          <p className="text-[16px] text-[#55605A] mt-2">
                            Page not found
                          </p>
                          <a
                            href="/"
                            className="inline-block mt-4 text-[14px] text-[#1E7A34] hover:underline"
                          >
                            Go back home
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </AuthProvider>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;