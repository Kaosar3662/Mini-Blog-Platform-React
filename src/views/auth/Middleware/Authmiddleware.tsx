import { Navigate } from 'react-router-dom';
export const getAuth = () => {
  const auth = localStorage.getItem('auth');
  return auth ? JSON.parse(auth) : null;
};

export const isLoggedIn = () => {
  const auth = getAuth();
  return !!auth?.token;
};

export const getUserRole = () => {
  const auth = getAuth();
  return auth?.role || null;
};

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const auth = getAuth();
  const role = auth?.role || null;

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/auth/404" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
