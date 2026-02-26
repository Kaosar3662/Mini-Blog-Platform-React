import { Sidebar, SidebarItemGroup, SidebarItems } from 'flowbite-react';
import { getSidebarItems } from './Sidebaritems';
import NavItems from './NavItems';
import SimpleBar from 'simplebar-react';
import FullLogo from '../shared/logo/FullLogo';
import NavCollapse from './NavCollapse';

const SidebarLayout = () => {
  const SidebarContent = getSidebarItems();

  return (
    <>
      <div className="xl:block hidden">
        <Sidebar
          className="fixed menu-sidebar  bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0 top-18"
          aria-label="Sidebar with multi-level dropdown example"
        >
          <div className="px-5 py-4 flex items-center sidebarlogo">
            <FullLogo />
          </div>
          <SimpleBar className="h-[calc(100vh)]">
            <SidebarItems className=" mt-2">
              <SidebarItemGroup className="sidebar-nav hide-menu">
                {SidebarContent.map((item) => (
                  <div key={item.heading}>
                    <h5 className="text-dark/60 uppercase font-medium leading-6 text-xs pb-2 ps-6">
                      {item.heading}
                    </h5>
                    {item.children?.map((child) =>
                      child.children ? (
                        <div className="collpase-items cursor-pointer">
                          <NavCollapse item={child} />
                        </div>
                      ) : (
                        <div className="cursor-pointer">
                          <NavItems item={child} />
                        </div>
                      ),
                    )}
                  </div>
                ))}
              </SidebarItemGroup>
            </SidebarItems>
          </SimpleBar>
        </Sidebar>
      </div>
    </>
  );
};

export default SidebarLayout;
