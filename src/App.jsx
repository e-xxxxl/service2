import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from './context/AuthContext';

import Navbar from "./components/Navbar/Navbar.jsx";
import HomePage from './Pages/HomePage.jsx';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import EmailVerification from './components/Auth/EmailVerification.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
// import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProviderDashboard from './components/Dashboard/ProviderDashboard.jsx';

function App() {
  return (
      <AuthProvider>                    {/* ← Must wrap ALL routes */}
        <div className="min-h-screen flex flex-col">
         

          <main className="flex-1">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/directory" element={<div className="p-20 text-center text-2xl">Directory Page</div>} />

              {/* Auth Routes */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<EmailVerification />} />

              {/* Protected Routes (uncomment when ready) */}
              <Route
                path="/dashboard/*"
                element={
                 
                    <Dashboard/>
                 
                }
              />
              <Route
                path="/provider-dashboard"
                element={
                 
                    <ProviderDashboard/>
                 
                }
              />
            </Routes>
          </main>

         
        </div>
      </AuthProvider>
   
  );
}

export default App;