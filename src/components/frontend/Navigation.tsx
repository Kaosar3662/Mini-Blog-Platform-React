import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

type NavLinkItem = {
  name: string;
  path: string;
};

const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const token = localStorage.getItem('auth');

  const links: NavLinkItem[] = token
    ? [{ name: 'Dashboard', path: '/dashboard' }]
    : [
        { name: 'Register', path: 'auth/register' },
        { name: 'Login', path: 'auth/login' },
      ];

  const handleLinkClick = (link: NavLinkItem) => {
    if (link.name === 'Logout') {
      localStorage.clear();
      window.location.reload();
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-white w-full fixed z-40 shadow-md">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="shrink-0">
              <Link to="/" className="text-xl font-bold text-primary">
                Mini_Blog
              </Link>
            </div>

            {/* Desktop Links */}

            <div className="hidden md:flex space-x-4">
              {links.map((link) => (
                <Link to={link.path} onClick={() => handleLinkClick(link)}>
                  <Button className="">{link.name}</Button>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className=" focus:outline-none p-2 rounded">
                {menuOpen ? (
                  <FiX className="w-6 h-6 fill-black text-black" />
                ) : (
                  <FiMenu className="w-6 h-6 fill-black text-black" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white px-2 pt-2 pb-4 space-y-1 shadow-md">
            {links.map((link) => (
              <Link to={link.path} onClick={() => handleLinkClick(link)}>
                <Button className="mb-2">{link.name}</Button>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Spacer to prevent content jump */}
    </>
  );
};

export default Navigation;
