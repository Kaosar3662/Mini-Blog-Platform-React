import React from 'react';
import { Button, Card } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { HiMailOpen } from 'react-icons/hi';

const ThanksForRegister: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center pt-20 px-4 min-h-[calc(100vh-64px)]">
      <Card className="max-w-lg w-full text-center p-8 bg-white shadow-md rounded-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 p-5 rounded-full shadow-lg">
            <HiMailOpen className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="mb-3 text-3xl text-primary font-semiboldtext-primary">
          Registration Successful!
        </h2>

        <p className="mb-6 text-gray-700 text-base">
          Thank you for joining us. A confirmation email has been sent to your inbox. Please{' '}
          <span className="font-bold">verify your email</span> to activate your account. You can
          also try logging in now.
        </p>

        <Button color="primary" onClick={() => navigate('/auth/login')} className="w-full">
          Go to Login
        </Button>
      </Card>
    </div>
  );
};

export default ThanksForRegister;
