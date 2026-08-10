// components/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthShell from './AuthLayout';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell eyebrow="Check your email" title="Reset link sent">
        <div className="mt-20 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-[#2d333f]">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500">
            If an account exists for <span className="font-medium text-[#2d333f]">{email}</span>, we've sent a link to reset your password. It expires in 1 hour.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#f06d00] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Forgot password" title="Reset your password">
      <div className="mb-8 mt-20">
        <h1 className="text-2xl font-semibold text-[#2d333f]">Forgot your password?</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Enter the email on your account and we'll send you a link to reset it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#2d333f] mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#f06d00] focus:ring-1 focus:ring-[#f06d00]/20 transition-all"
              placeholder="jordan@example.com"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#f06d00] hover:bg-[#e05f00] active:bg-[#d15a00] text-white py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Send reset link <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-[#2d333f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
