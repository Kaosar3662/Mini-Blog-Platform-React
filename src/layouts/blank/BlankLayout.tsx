import { Outlet } from 'react-router-dom';
import Navigation from 'src/components/frontend/Navigation';
import Footer from "../../components/frontend/Footer";

const BlankLayout = () => (
  <>
    <Navigation />
    <Outlet />
    <Footer/>
  </>
);

export default BlankLayout;
