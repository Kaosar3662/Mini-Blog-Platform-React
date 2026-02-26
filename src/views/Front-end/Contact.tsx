import React, { useState, FormEvent } from 'react';
import { TextInput, Textarea, Button } from 'flowbite-react';
import { apiService, useUI } from '../../Api/Axios';
import { useNavigate } from 'react-router-dom';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const { setLoader, setAlert } = useUI();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAlert(null);
    const response = await apiService.request(
      'post',
      'contact',
      form,
      {},
      setLoader,
      setAlert,
      setErrors,
    );

    if (response.success === true) {
      debugger;
      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
      setIsSuccess(true);
    }
  };

  return (
    <>
      {isSuccess ? (
        <div className="fixed inset-0 flex items-center justify-center bg-[#EEF3F8] z-10">
          <div className="bg-white rounded-2xl shadow-md px-8 py-10 text-center max-w-md w-full">
            <h1 className="text-3xl font-semibold mb-6">Thank You ☺️</h1>
            <p>We will reach you back soon</p>
            <Button onClick={() => navigate(`/}`)} className="mt-6 w-full rounded-2xl">
              Go Home
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-20 px-4 min-h-[calc(100vh-64px)]">
          <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-md px-6 py-8">
            <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <TextInput
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <TextInput
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <TextInput
                  type="text"
                  name="subject"
                  id="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
                {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  name="message"
                  id="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                />
                {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
              </div>
              <div>
                <Button type="submit" className="w-full rounded-2xl">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
