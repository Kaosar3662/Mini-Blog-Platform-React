import React, { useState, useEffect } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { useNavigate, useSearchParams } from 'react-router';
import { apiService, useUI } from '../../../Api/Axios';

interface Errors {
  password?: string;
  c_password?: string;
}

const ResetPass: React.FC = () => {
  const navigate = useNavigate();
  const { setLoader, setAlert } = useUI();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    token: '',
    password: '',
    c_password: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [linkExpired, setLinkExpired] = useState<boolean>(false);

  // Automatically set token from URL param
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setFormData((prev) => ({
        ...prev,
        token: tokenFromUrl,
      }));
    } else {
      setLinkExpired(true);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    setAlert(null);
    const response = await apiService.request(
      'post',
      'auth/password/reset',
      formData,
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

    if (response?.success) {
      navigate('/auth/login');
    }

    if (response?.code === 400 || response?.code === 404) {
      setLinkExpired(true);
    }
  };

  return (
    <div className="relative overflow-hidden pt-20 flex min-h-[calc(100vh-64px)] justify-center items-center px-4">
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative wrap-break-word md:w-105 w-full border-none">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-4">
          <div>
            <TextInput
              id="password"
              type="password"
              placeholder="New Password"
              required
              value={formData.password}
              onChange={handleChange}
              color={errors.password ? 'failure' : undefined}
              className="form-rounded-xl"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <TextInput
              id="c_password"
              type="password"
              placeholder="Confirm Password"
              required
              value={formData.c_password}
              onChange={handleChange}
              color={errors.c_password ? 'failure' : undefined}
              className="form-rounded-xl"
            />
            {errors.c_password && <p className="mt-1 text-xs text-red-600">{errors.c_password}</p>}
          </div>

          <Button color="primary" type="submit" className="w-full mt-2 shadow-md">
            Reset Password
          </Button>
        </form>

        {linkExpired && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full mx-4 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Reset Link Expired</h2>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Button onClick={() => navigate('/forgot-password')} className="w-full shadow-md">
                Request New Link
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPass;
