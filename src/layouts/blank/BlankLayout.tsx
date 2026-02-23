import { Outlet } from "react-router";
import Navigation from "src/components/frontend/Navigation";

const BlankLayout = () => (
  <>
    <Navigation/>
    <Outlet />
  </>
);

export default BlankLayout;
