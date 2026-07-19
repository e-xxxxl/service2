// components/admin/AdminLogin.jsx
import { useState } from "react";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      localStorage.setItem('authToken', data.token);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E2420] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-[#F0821E] mx-auto mb-4" />
          <h1 className="text-[24px] font-bold text-white font-['Space_Grotesk',sans-serif]">Admin Login</h1>
          <p className="text-[14px] text-white/50 mt-1">9jaTradiesPages Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-700">{error}</div>}
          
          <div>
            <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9488]" />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E0D9] text-[14px] focus:outline-none focus:border-[#F0821E] focus:ring-1 focus:ring-[#F0821E]/20 transition-all" 
                placeholder="admin@example.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9488]" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#E2E0D9] text-[14px] focus:outline-none focus:border-[#F0821E] focus:ring-1 focus:ring-[#F0821E]/20 transition-all" 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9488] hover:text-[#55605A] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#F0821E] hover:bg-[#D5720F] text-white py-3.5 rounded-xl text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>Sign In <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}