// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import  { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router";
import Loadable from 'src/layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// Main
const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));
const Categories = Loadable(lazy(() => import('../views/dashboards/Categories')));
const Users = Loadable(lazy(() => import('../views/dashboards/UsersPage')));

// utilities
const Form = Loadable(lazy(() => import("../views/forms/Form")));
const Buttons = Loadable(lazy(() => import("../views/buttons/Buttons")));

// icons
const Solar = Loadable(lazy(() => import("../views/icons/Solar")));

// authentication
const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Register = Loadable(lazy(() => import('../views/auth/register/Register')));
const Reset = Loadable(lazy(() => import('../views/auth/authforms/ResetPass')));
const VerifyEmail = Loadable(lazy(() => import('../views/auth/authforms/Verifymail')));
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));
// Pages
const Home = Loadable(lazy(() => import('../views/Front-end/Home')));
const Thanks = Loadable(lazy(() => import('../views/Front-end/Thanksforregister')));
const Resetsent = Loadable(lazy(() => import('../views/Front-end/ResetPassSend')));



const Router = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/', exact: true, element: <Home /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/thanksforregistering', element: <Thanks /> },
      { path: '/resetpasssent', element: <Resetsent /> },
      { path: '/reset-password', element: <Reset /> },
      { path: '/verify-email', element: <VerifyEmail /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/ui/form', exact: true, element: <Form /> },
      { path: '/ui/buttons', exact: true, element: <Buttons /> },
      { path: '/icons/solar', exact: true, element: <Solar /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/categories', exact: true, element: <Categories /> },
      { path: '/users', exact: true, element: <Users /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router)

export default router;
