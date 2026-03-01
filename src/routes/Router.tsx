// src/routes/Router.tsx
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Loadable from 'src/layouts/full/shared/loadable/Loadable';
import ProtectedRoute from 'src/views/auth/Middleware/Authmiddleware';

/* Layouts */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* Views*/
const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));
const Categories = Loadable(lazy(() => import('../views/dashboards/Categories')));
const Createblog = Loadable(lazy(() => import('../views/dashboards/Createpost')));
const ContactMessage = Loadable(lazy(() => import('../views/dashboards/Contactmesssage')));
const Comments = Loadable(lazy(() => import('../views/dashboards/Comments')));
const AllPost = Loadable(lazy(() => import('../views/dashboards/Allpost')));   
const Myposts = Loadable(lazy(() => import('../views/dashboards/Mypost')));
const Users = Loadable(lazy(() => import('../views/dashboards/UsersPage')));

/* Auth & Public */
const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Register = Loadable(lazy(() => import('../views/auth/register/Register')));
const Reset = Loadable(lazy(() => import('../views/auth/authforms/ResetPass')));
const VerifyEmail = Loadable(lazy(() => import('../views/auth/authforms/Verifymail')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));

const Home = Loadable(lazy(() => import('../views/Front-end/Home')));
const Contact = Loadable(lazy(() => import('../views/Front-end/Contact')));
const Posts = Loadable(lazy(() => import('../views/Front-end/AllPosts')));
const PostDetails = Loadable(lazy(() => import('../views/Front-end/Postdetails')));
const Thanks = Loadable(lazy(() => import('../views/Front-end/Thanksforregister')));
const Resetsent = Loadable(lazy(() => import('../views/Front-end/ResetPassSend')));

const adminRoutes = [{ path: '/users', element: <Users /> }];

const moderatorRoutes = [
  { path: '/categories', element: <Categories /> },
  { path: '/cmessage', element: <ContactMessage /> },
  { path: '/comments', element: <Comments /> },
  { path: '/allposts', element: <AllPost /> },
];

const bloggerRoutes = [
  { path: '/newpost', element: <Createblog /> },
  { path: '/myposts', element: <Myposts /> },
  { path: '/newpost/:slug', element: <Createblog /> },
];

const CommonRoutes = [{ path: '/dashboard', element: <Dashboard /> }];

const adminOnly = ['admin'];
const modAndAbove = ['admin', 'moderator'];
const allStaff = ['admin', 'moderator', 'blogger'];

const protectedRoutesMapping = [
  {
    allowedRoles: adminOnly,
    routes: [...adminRoutes],
  },
  {
    allowedRoles: modAndAbove,
    routes: [...moderatorRoutes],
  },
  {
    allowedRoles: allStaff,
    routes: [...bloggerRoutes, ...CommonRoutes],
  },
];

const protectedRoutes = protectedRoutesMapping.flatMap((group) =>
  group.routes.map((r) => ({
    ...r,
    element: <ProtectedRoute allowedRoles={group.allowedRoles}>{r.element}</ProtectedRoute>,
  })),
);

const Router = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/', exact: true, element: <Home /> },
      { path: '/postdetails/:slug', element: <PostDetails /> },
      { path: '/posts', element: <Posts /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/thanksforregistering', element: <Thanks /> },
      { path: '/verify-email', element: <VerifyEmail /> },
      { path: '/resetpasssent', element: <Resetsent /> },
      { path: '/reset-password', element: <Reset /> },
      { path: '/contact', element: <Contact /> },
      { path: '*', element: <Error /> },
    ],
  },
  {
    path: '/',
    element: <FullLayout />,
    children: [...protectedRoutes, { path: '*', element: <Error /> }],
  },
];

const router = createBrowserRouter(Router);
export default router;
