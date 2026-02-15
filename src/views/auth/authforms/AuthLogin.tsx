import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import Spinner from 'src/views/spinner/Spinner';
import { Link, useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import apiService from '../../../Api/Axios';

const AuthLogin = () => {
  const navigate = useNavigate();

  const [loadeer, setLoader] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  type FormErrors = {
    email?: string;
    password?: string;
  };
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const auth = localStorage.getItem('auth');
  }, []);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoader(true);
    const response = await apiService.request('post', '/auth/login', formData);
    const token = response?.token;
    setLoader(false);

    if (token) {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token,
        }),
      );
    } else if (response?.errors) {
      setErrors(response.errors);
    }
    navigate('/dashboard');
  };

  return (
    <>
      {loadeer && (
        <div className='absolute bg-white/80 inset-0 z-10'>

          <Spinner/>
        </div>
      )}
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
          {/* <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label htmlFor="accept" className="opacity-90 font-normal cursor-pointer">
              Remeber this Device
            </Label>
          </div> */}
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
