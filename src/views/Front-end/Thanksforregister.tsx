import React, { useState } from 'react';
import { Button, Card, TextInput, Label } from 'flowbite-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiMailOpen } from 'react-icons/hi';
import { apiService, useUI } from '../../Api/Axios';

const ThanksForRegister: React.FC = () => {
  const { setLoader, setAlert } = useUI();
  const location = useLocation();
  const userData = location.state || {};
  const from = userData.from;
  console.log(userData)


  const handleResendSubmit = async () => {

    const email = userData.email;

    setAlert(null);
    const response = await apiService.request(
      'post',
      'auth/email/resend',
      { email } ,
      {},
      setLoader,
      setAlert,
      undefined,
      true
    );
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20 px-4 min-h-[calc(100vh-64px)]">
      <Card className="max-w-lg w-full text-center p-8 bg-white shadow-md rounded-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 p-5 rounded-full shadow-lg">
            <HiMailOpen className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="mb-3 text-3xl text-primary font-semibold">
          {from === 'login' ? 'Verify Your Email' : 'Registration Successful!'}
        </h2>

        <p className="mb-6 text-gray-700 text-base">
          {from === 'login'
            ? 'You need to verify your email before you can log in. Please check your inbox and verify your account.'
            : 'Thank you for joining us. A confirmation email has been sent to your inbox. Please verify your email to activate your account.'}
        </p>
        <p>If you didn't recieve the mail, Click The Button Below</p>
        <Button color="primary" onClick={handleResendSubmit} className="w-full">
          Resend The mail
        </Button>
      </Card>
    </div>
  );
};

export default ThanksForRegister;
