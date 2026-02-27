import React, { useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { apiService, useUI } from '../../../Api/Axios';

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

const AuthRegister: React.FC = () => {
  const navigate = useNavigate();
  const { setLoader, setAlert } = useUI();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors({});
    setAlert(null);
    const response = await apiService.request(
      'post',
      'auth/register',
      formData,
      {},
      setLoader,
      setAlert,
      setErrors,
    );

    if (response.success === true) {
      const userData = formData;
      navigate('/thanksforregistering', {
        state: { ...userData, from: 'register' },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <TextInput
          id="name"
          type="text"
          placeholder="Name"
          required
          value={formData.name}
          onChange={handleChange}
          color={errors.name ? 'failure' : undefined}
          className="form-rounded-xl"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <TextInput
          id="email"
          type="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
          color={errors.email ? 'failure' : undefined}
          className="form-rounded-xl"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div>
        <TextInput
          id="password"
          type="password"
          placeholder="Password"
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
          id="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          required
          value={formData.password_confirmation}
          onChange={handleChange}
          color={errors.password_confirmation ? 'failure' : undefined}
          className="form-rounded-xl"
        />
        {errors.password_confirmation && (
          <p className="mt-1 text-xs text-red-600">{errors.password_confirmation}</p>
        )}
      </div>

      <Button color="primary" type="submit" className="w-full mt-2">
        Sign Up
      </Button>
    </form>
  );
};

export default AuthRegister;
