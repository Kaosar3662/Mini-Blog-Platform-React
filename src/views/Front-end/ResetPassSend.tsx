import { Button, Card } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import React from 'react';
import { apiService, useUI } from '../../Api/Axios';

const ResetPasswordSent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state as string;
  const { setAlert, setLoader } = useUI();

  const handleForgotSubmit = async () => {
    setAlert(null);

    await apiService.request(
      'post',
      'auth/password/forgot',
      { email },
      {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      },
      setLoader,
      setAlert,
      undefined,
      true,
    );
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20 px-4 min-h-[calc(100vh-88px)]">
      <Card className="max-w-lg w-full text-center p-8 bg-white shadow-md rounded-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 p-5 rounded-full shadow-lg">
            <HiOutlineMail className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="mb-3 text-3xl font-bold text-primary">Check Your Email</h2>

        <p className="mb-6 text-gray-700 text-base">
          We have sent a password reset link to your email address. Please check your{' '}
          <span className="font-bold">inbox and spam folder</span>. The link will expire in 1 hour.
        </p>

        <div className="flex flex-col gap-3">
          <Button color="primary" onClick={() => navigate('/auth/login')} className="w-full">
            Return to Login
          </Button>

          <button onClick={handleForgotSubmit} className="text-sm text-gray-500 hover:underline">
            Didn't receive the email? Click to resend
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordSent;
