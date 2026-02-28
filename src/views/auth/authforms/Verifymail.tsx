import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService, useUI } from '../../../Api/Axios';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { setLoader, setAlert } = useUI();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [linkExpired, setLinkExpired] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setLinkExpired(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      setAlert(null);

      const response = await apiService.request(
        'post',
        'auth/email/verify',
        { token },
        {},
        setLoader,
        setAlert,
      );

      if (response?.success) {
        navigate('/auth/login');
      } else {
        setLinkExpired(true);
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendSubmit = async () => {
    setAlert(null);

    const response = await apiService.request(
      'post',
      'auth/email/resend',
      { token },
      {},
      setLoader,
      setAlert,
    );

    if (response?.success) {
      navigate('/auth/login');
    } else {
      setLinkExpired(true);
    }
  };

  return (
    <div className="relative overflow-hidden pt-20 flex [calc(100vh-88min-h-px)] justify-center items-center px-4">
      {linkExpired && (
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Token Expired</h2>

          <p className="text-gray-600 mb-6">This verification link is invalid or has expired.</p>

          <Button onClick={handleResendSubmit} className="w-full shadow-md mb-2">
            Resend Verification Email
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
