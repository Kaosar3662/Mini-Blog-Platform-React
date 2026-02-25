// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import  { lazy } from 'react';
import { createBrowserRouter } from "react-router";
import Loadable from 'src/layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// Main
const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));
const Categories = Loadable(lazy(() => import('../views/dashboards/Categories')));
const Createblog = Loadable(lazy(() => import('../views/dashboards/Createpost')));
const Myposts = Loadable(lazy(() => import('../views/dashboards/Mypost')));
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
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));
// Pages
const Home = Loadable(lazy(() => import('../views/Front-end/Home')));
const Contact = Loadable(lazy(() => import('../views/Front-end/Contact')));
const Thanks = Loadable(lazy(() => import('../views/Front-end/Thanksforregister')));
const Resetsent = Loadable(lazy(() => import('../views/Front-end/ResetPassSend')));



const Router = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/home', exact: true, element: <Home /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/thanksforregistering', element: <Thanks /> },
      { path: '/resetpasssent', element: <Resetsent /> },
      { path: '/reset-password', element: <Reset /> },
      { path: '/verify-email', element: <VerifyEmail /> },
      { path: '/contact', element: <Contact /> },
      { path: '404', element: <Error /> },
      { path: '*', element: <Error /> },
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
      { path: '/categories', exact: true, element: <Categories /> },
      { path: '/newpost', exact: true, element: <Createblog /> },
      { path: '/myposts', exact: true, element: <Myposts /> },
      { path: '/newpost/:slug', exact: true, element: <Createblog /> },
      { path: '/users', exact: true, element: <Users /> },
      { path: '*', element: <Error /> },
    ],
  },
];

const router = createBrowserRouter(Router)

export default router;
