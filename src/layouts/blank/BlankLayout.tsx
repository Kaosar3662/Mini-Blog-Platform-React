import { Outlet } from 'react-router-dom';
import Navigation from 'src/components/frontend/Navigation';

const BlankLayout = () => (
  <>
    <Navigation />
    <Outlet />
  </>
);

export default BlankLayout;
