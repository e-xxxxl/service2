// components/auth/EmailVerification.jsx
import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmailVerification = ({ email }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();

  const [status, setStatus] = useState('pending'); // pending, verifying, success, error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleVerifyEmail(token);
    }
  }, [token]);

  const handleVerifyEmail = async (verificationToken) => {
    setStatus('verifying');
    try {
      await verifyEmail(verificationToken);
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Verification failed. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError('');

    try {
      await resendVerification(email);
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
          {/* Pending State */}
          {status === 'pending' && (
            <>
              <div className="w-20 h-20 bg-[#f06d00]/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Mail className="w-10 h-10 text-[#f06d00]" />
              </div>

              <h2 className="text-3xl font-semibold text-[#2d333f] mb-3">Check your email</h2>
              <p className="text-gray-600 mb-8">
                We've sent a verification link to{' '}
                <span className="font-medium text-[#2d333f] break-all">{email}</span>
              </p>

              <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Click the link in the email to verify your account. 
                    Don’t forget to check your spam folder.
                  </p>
                </div>
              </div>

              <button
                onClick={handleResendVerification}
                disabled={loading || countdown > 0}
                className="w-full bg-gray-100 hover:bg-gray-200 text-[#2d333f] py-3.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 mb-6"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend verification email
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/login')}
                className="text-sm text-[#f06d00] hover:underline font-medium"
              >
                Back to sign in
              </button>
            </>
          )}

          {/* Verifying State */}
          {status === 'verifying' && (
            <>
              <div className="w-20 h-20 border-4 border-[#f06d00] border-t-transparent rounded-full animate-spin mx-auto mb-8" />
              <h2 className="text-2xl font-semibold text-[#2d333f] mb-3">Verifying your email</h2>
              <p className="text-gray-500">This should only take a moment...</p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-11 h-11 text-green-600" />
              </div>
              <h2 className="text-3xl font-semibold text-[#2d333f] mb-3">Email verified successfully!</h2>
              <p className="text-gray-600 mb-8">
                Welcome aboard. Redirecting you to your dashboard...
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#f06d00] h-1.5 rounded-full w-0 animate-[progress_1.8s_ease-in-out_forwards]" />
              </div>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-11 h-11 text-red-600" />
              </div>
              <h2 className="text-3xl font-semibold text-[#2d333f] mb-3">Verification failed</h2>
              <p className="text-gray-600 mb-8">{error}</p>

              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full bg-[#f06d00] hover:bg-[#e05f00] text-white py-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mb-6"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Request new verification link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-500 hover:text-[#2d333f] font-medium"
              >
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default EmailVerification;