// pages/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const accountType = searchParams.get('accountType');
    const needsProfileSetup = searchParams.get('needsProfileSetup') === 'true';
    const oauthError = searchParams.get('error');

    if (oauthError) {
      setError('Google sign-in was cancelled or failed. Please try again.');
      setTimeout(() => navigate('/login?error=google_failed'), 1500);
      return;
    }

    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userAccountType', accountType);

      // Populate AuthContext's user immediately - without this, pages
      // reached right after this redirect would see a null user until a
      // full page reload remounts AuthProvider.
      refreshUser?.().finally(() => {
        if (accountType === 'provider') {
          navigate(needsProfileSetup ? '/provider/setup' : '/provider-dashboard');
        } else {
          navigate('/dashboard');
        }
      });
    } else {
      navigate('/login?error=google_failed');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}