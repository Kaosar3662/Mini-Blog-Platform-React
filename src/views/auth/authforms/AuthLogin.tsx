import { Button, Label, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import { apiService, useUI } from '../../../Api/Axios';
import { isLoggedIn } from '../checklogin/checklogin';

const AuthLogin = () => {
  const navigate = useNavigate();
  const { setAlert, setLoader } = useUI();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    }
  }, []);

  type FormErrors = {
    email?: string;
    password?: string;
    general?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await apiService.request(
      'post',
      '/auth/login',
      formData,
      {},
      setLoader,
      setAlert,
      setErrors,
    );

    if (response.success === true && response.data?.token) {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token: response.data.token,
          role: response.data.role,
        }),
      );
      navigate('/dashboard');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label>Username</Label>
          </div>
          <TextInput
            id="email"
            name="email"
            type="text"
            sizing="md"
            required
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label>Password</Label>
          </div>
          <TextInput
            id="password"
            name="password"
            type="password"
            sizing="md"
            required
            value={formData.password}
            onChange={handleChange}
            className="form-control"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="flex justify-between my-5">
          <Link to={'/'} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div>
        <Button type="submit" color={'primary'} className="w-full bg-primary text-white">
          Sign in
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
