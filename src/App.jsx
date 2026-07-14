// App.jsx - Fixed (NO BrowserRouter here)
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import HomePage from './Pages/HomePage.jsx';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import EmailVerification from './components/Auth/EmailVerification.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import ProviderDashboard from './components/Dashboard/ProviderDashboard.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/directory" element={
              <div className="p-20 text-center text-2xl">Directory Page</div>
            } />

            {/* Auth Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<EmailVerification />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;