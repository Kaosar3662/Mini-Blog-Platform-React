import FullLogo from 'src/layouts/full/shared/logo/FullLogo';
import AuthLogin from '../authforms/AuthLogin';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../Middleware/Authmiddleware';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    }
  }, []);
  return (
    <div className="flex justify-center items-center relative overflow-hidden min-h-[calc(100vh-64px)] pt-20">
      <div className="flex h-full justify-center items-center px-4">
        <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 w-full md:w-105 border-none">
          <div className="flex flex-col gap-2 p-0 w-full">
            <div className="mx-auto">
              <FullLogo />
            </div>
            <p className="text-sm text-center text-dark my-3">Sign In To Continue</p>
            <AuthLogin />
            <div className="flex gap-2 text-base text-ld font-medium mt-6 items-center justify-center">
              <p>Are you new here?</p>
              <Link to="/auth/register" className="text-primary text-sm font-medium">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
