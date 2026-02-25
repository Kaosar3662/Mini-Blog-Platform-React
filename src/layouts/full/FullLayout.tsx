import { FC } from 'react';
import { Outlet } from 'react-router';

import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import Topbar from './header/Topbar';
import { useNavigate } from 'react-router';

const FullLayout: FC = () => {
  const token = localStorage.getItem('auth');
  const navigate = useNavigate();
  if (!token) {
    navigate(`/home`)
  }
  return (
    <>
      <Topbar />
      <div className="flex w-full min-h-100vh">
        <div className="page-wrapper flex w-full h-full">
          {/* Header/sidebar */}
          <Sidebar />
          <div className="container flex flex-col h-full w-full pt-6">
            {/* Top Header  */}
            <Header />

            <div className={`h-full`}>
              {/* Body Content  */}
              <div className={`w-full`}>
                <div className="container px-0 py-6 flex-1 flex flex-col">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FullLayout;
