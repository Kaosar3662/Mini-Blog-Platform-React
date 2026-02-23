import React, { useState, useEffect } from 'react';
import { Button, TextInput, Label } from 'flowbite-react';
import { useNavigate, useSearchParams } from 'react-router';
import { apiService, useUI } from '../../../Api/Axios';

interface Errors {
  email?: string;
  general?: string;
}

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { setLoader, setAlert } = useUI();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [linkExpired, setLinkExpired] = useState(false);
  const [resendModalOpen, setResendModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  // Get token from URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setLinkExpired(true);
    }
  }, [searchParams]);

  // Verify email on mount
  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      const response = await apiService.request(
        'post',
        'auth/email/verify',
        { token },
        {},
        setLoader,
        setAlert,
        setErrors,
      );

      if (response?.success) {
        navigate('auth/login');
      }
        setLinkExpired(true);
    };

    verifyEmail();
  }, [token]);

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await apiService.request(
      'post',
      'auth/email/resend',
      { email },
      {},
      setLoader,
      setAlert,
      setErrors,
    );

  if (response?.success) {
    navigate('/auth/login');
  }

  if (response?.code === 400 || response?.code === 404) {
    setLinkExpired(true);
  }
  };

  return (
    <div className="relative overflow-hidden pt-20 flex min-h-[calc(100vh-64px)] justify-center items-center px-4">
      {linkExpired && (
        <div>
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Token Expired</h2>
            <p className="text-gray-600 mb-6">This verification link is invalid or has expired.</p>
            <Button onClick={() => setResendModalOpen(true)} className="w-full shadow-md mb-2">
              Resend Verification Email
            </Button>
          </div>
        </div>
      )}

      {resendModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Resend Verification</h2>
            <form onSubmit={handleResendSubmit} className="flex flex-col gap-4">
              <div className='flex flex-col gap-2 items-start w-full'>
                <Label htmlFor="email">Email</Label>
                <TextInput
                  id="email"
                  type="email"
                  className='w-full'
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <Button type="submit" className="w-full mt-2 shadow-md">
                Send Verification Email
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
