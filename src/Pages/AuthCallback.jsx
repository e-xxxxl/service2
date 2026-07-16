// pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const accountType = searchParams.get('accountType');
    const needsProfileSetup = searchParams.get('needsProfileSetup') === 'true';

    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userAccountType', accountType);

      if (accountType === 'provider') {
        navigate(needsProfileSetup ? '/provider-dashboard?setup=true' : '/provider-dashboard');
      } else {
        navigate('/dashboard');
      }
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