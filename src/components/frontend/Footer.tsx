

import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-md text-black py-8 ">
      <div className="max-w-4xl px-4 mx-auto flex flex-col md:flex-row items-center justify-between">
        <nav className="mb-4 md:mb-0">
          <ul className="flex flex-col md:flex-row items-center gap-4">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/posts" className="hover:text-primary transition-colors">
                All Post
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="text-sm text-center md:text-right">
          © 2026 Mini_Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;