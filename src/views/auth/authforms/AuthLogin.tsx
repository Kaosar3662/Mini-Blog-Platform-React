import { Button, Label, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { apiService, useUI } from '../../../Api/Axios';

type LoginFormData = {
  email: string;
  password: string;
};

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

const AuthLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setAlert, setLoader } = useUI();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [resendModalOpen, setResendModalOpen] = useState<boolean>(false);
  const [resendEmail, setResendEmail] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors({});
    setAlert(null);
    const response = await apiService.request(
      'post',
      '/auth/login',
      formData,
      {},
      setLoader,
      setAlert,
      setErrors,
      true,
    );
    if (response.message == 'Please verify your email first') {
      const userData = formData;
      navigate('/thanksforregistering', {
        state: { ...userData, from: 'login' },
      });
    }
    if (response?.success && response?.data?.token) {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token: response.data.token,
          role: response.data.role,
        }),
      );
      debugger;
      setFormData({
        email: '',
        password: '',
      });
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        navigate('/dashboard');
      }, 1000);
    }
  };

  const openResendModal = () => {
    setResendModalOpen(true);
  };

  const closeResendModal = () => {
    setResendModalOpen(false);
    setResendEmail('');
  };

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    setAlert(null);
    const res = await apiService.request(
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

    if (res.success) {
      navigate('/resetpasssent', { state: resendEmail });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="email">Username</Label>
          </div>
          <TextInput
            id="email"
            name="email"
            type="text"
            required
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="password">Password</Label>
          </div>
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="flex justify-between my-5">
          <p onClick={openResendModal} className="text-primary text-sm font-medium cursor-pointer">
            Forgot Password?
          </p>
        </div>

        <Button type="submit" className="w-full bg-primary text-white shadow-md">
          Sign in
        </Button>
      </form>

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
    </>
  );
};

export default AuthLogin;
