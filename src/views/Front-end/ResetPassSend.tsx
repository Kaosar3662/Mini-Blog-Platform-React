import { Button, Card, Label, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { HiOutlineMail } from 'react-icons/hi';
import React, { useState } from 'react';
import { apiService, useUI } from '../../Api/Axios';

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

const ResetPasswordSent: React.FC = () => {
  const navigate = useNavigate();
  const { setAlert, setLoader } = useUI();
  const [resendModalOpen, setResendModalOpen] = useState<boolean>(false);
  const [resendEmail, setResendEmail] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const openResendModal = () => {
    setResendModalOpen(true);
  };

  const closeResendModal = () => {
    setResendModalOpen(false);
    setResendEmail('');
  };

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await apiService.request(
      'post',
      'auth/password/forgot',
      { email: resendEmail },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      setLoader,
      setAlert,
      setErrors,
    );

    closeResendModal();
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20 px-4 min-h-[calc(100vh-64px)]">
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

          <button onClick={openResendModal} className="text-sm text-gray-500 hover:underline">
            Didn't receive the email? Click to resend
          </button>
        </div>
      </Card>
      {resendModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeResendModal}
        >
          <div
            className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-md p-6 transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Forgot Password</h2>
              <button onClick={closeResendModal} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleForgotSubmit}>
              <div className="mb-4">
                <Label htmlFor="resendEmail">Email</Label>
                <TextInput
                  id="resendEmail"
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <Button type="submit" className="w-full bg-primary text-white shadow-md">
                Send Reset Link
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordSent;
