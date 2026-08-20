// components/auth/SignUp.jsx
import React, { useState, useMemo } from 'react';
import { Mail, Lock, User, Briefcase, ArrowRight, Eye, EyeOff, Check, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmailVerification from './EmailVerification';
import AuthShell from './AuthLayout';
import Navbar from '../Navbar/Navbar';
import GoogleButton from './GoogleButton';
import { SERVICE_CATEGORIES } from '../../constants/serviceCategories';
import { useLocations } from '../../hooks/useLocations';
import { friendlyErrorMessage } from '../../utils/apiError';

const PASSWORD_RULES = [
  { key: 'minLength', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'hasUpper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'hasLower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { key: 'hasNumber', label: 'One number', test: (p) => /\d/.test(p) },
  { key: 'hasSpecial', label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const STRENGTH_LEVELS = [
  { label: 'Weak', color: '#dc2626' },
  { label: 'Weak', color: '#dc2626' },
  { label: 'Fair', color: '#d97706' },
  { label: 'Good', color: '#2563eb' },
  { label: 'Strong', color: '#16a34a' },
  { label: 'Strong', color: '#16a34a' },
];

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [accountType, setAccountType] = useState('customer');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    serviceType: '',
    state: '',
    city: '',
  });

  const { states: NIGERIAN_STATES, getLgas } = useLocations();
  const citiesForState = getLgas(formData.state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'state') setFormData((prev) => ({ ...prev, city: '' }));
    if (error) setError('');
  };

  const passedRules = useMemo(() => PASSWORD_RULES.filter((rule) => rule.test(formData.password)), [formData.password]);
  const strengthScore = formData.password ? passedRules.length : 0;
  const strength = STRENGTH_LEVELS[strengthScore];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://service-server-e64r.onrender.com/api';
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, accountType }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Signup failed');
      setStep(2);
    } catch (err) { setError(friendlyErrorMessage(err)); }
    finally { setLoading(false); }
  };

  if (step === 2) return <EmailVerification email={formData.email} />;

  return (
    <AuthShell eyebrow="Create your account" title={<>Get help from a<br />pro you can trust.</>}>
      <Navbar />
      <div className="mb-8 pt-20">
        <h1 className="text-2xl font-semibold text-[#2d333f]">Create your account</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/login')} className="text-[#f06d00] font-medium hover:underline">Sign in</button>
        </p>
      </div>

      <div className="relative grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-8">
        <div className="absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-[10px] shadow-sm transition-all duration-300"
          style={{ transform: accountType === 'provider' ? 'translateX(calc(100% + 8px))' : 'translateX(0)' }} />
        {[{ value: 'customer', label: 'I need a service', icon: User },{ value: 'provider', label: 'I provide a service', icon: Briefcase }]
          .map(({ value, label, icon: Icon }) => (
            <button key={value} type="button" onClick={() => setAccountType(value)}
              className={`relative z-10 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-colors ${accountType === value ? 'text-[#2d333f]' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {error && <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#2d333f] mb-1.5">Full name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#f06d00] focus:ring-1 focus:ring-[#f06d00]/20 transition-all" placeholder="Jordan Ellis" required />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#2d333f] mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#f06d00] focus:ring-1 focus:ring-[#f06d00]/20 transition-all" placeholder="jordan@example.com" required />
          </div>
        </div>

        {/* ✅ Phone for ALL users */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#2d333f] mb-1.5">Phone number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#f06d00] focus:ring-1 focus:ring-[#f06d00]/20 transition-all" placeholder="+234 801 234 5678" required />
          </div>
        </div>

        {/* State & City for ALL users */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-[#2d333f] mb-1.5">State</label>
            <select id="state" name="state" value={formData.state} onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f06d00] focus:ring-1 focus:ring-[#f06d00]/20 transition-all">
              <option value="">Select state</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-[#2d333f] mb-1.5">City</label>
            <select id="city" name="city" value={formData.city} onChange={handleChange} disabled={!formData.state}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f06d00] focus:ring-1 focus:ring-[#f06d00]/20 transition-all disabled:opacity-50">
              <option value="">Select city</option>
              {citiesForState.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Provider Fields */}
        {accountType === 'provider' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-[#2d333f] mb-1.5">Company name</label>
              <input id="companyName" type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" placeholder="Ellis Plumbing Co." required />
            </div>
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-[#2d333f] mb-1.5">Service type</label>
              <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" required>
                <option value="">Select a service</option>
                {Object.entries(SERVICE_CATEGORIES).map(([g, s]) => (<optgroup key={g} label={g}>{s.map(x => <option key={x} value={x.toLowerCase()}>{x}</option>)}</optgroup>))}
              </select>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#2d333f] mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#f06d00] focus:ring-1 focus:ring-[#f06d00]/20 transition-all" placeholder="Create a strong password" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formData.password && (
            <div className="mt-3">
              <div className="flex gap-1.5 mb-3">{PASSWORD_RULES.map((_, i) => (<div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ backgroundColor: i < strengthScore ? strength.color : '#e5e7eb' }} />))}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                {PASSWORD_RULES.map((rule) => { const isMet = rule.test(formData.password);
                  return (<div key={rule.key} className={`flex items-center gap-2 ${isMet ? 'text-emerald-700' : 'text-gray-400'}`}><Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isMet ? strength.color : '#9ca3af' }} /><span>{rule.label}</span></div>);
                })}
              </div>
            </div>
          )}
        </div>

        {/* ✅ Terms with proper links */}
        <div className="flex items-start gap-3 pt-2">
          <input type="checkbox" id="terms" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#f06d00] focus:ring-[#f06d00] focus:ring-offset-0" required />
          <label htmlFor="terms" className="text-sm text-gray-500 leading-relaxed">
            I agree to the{' '}
            <Link to="/terms-of-service" className="text-[#2d333f] hover:text-[#f06d00] underline underline-offset-2">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy-policy" className="text-[#2d333f] hover:text-[#f06d00] underline underline-offset-2">Privacy Policy</Link>
          </label>
        </div>

        <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">or continue with</span></div></div>
        <GoogleButton mode="signup" accountType={accountType || 'customer'} />

        <button type="submit" disabled={loading}
          className="w-full mt-3 bg-[#f06d00] hover:bg-[#e05f00] active:bg-[#d15a00] text-white py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>{accountType === 'provider' ? 'Create Provider Account' : 'Create Account'}<ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
    </AuthShell>
  );
};

export default SignUp;