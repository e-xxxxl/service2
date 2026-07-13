import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import navlogo from '../../assets/navlogoo.png';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', path: '/directory' },
    { name: 'Contact', path: '/cost-guides' },
    { name: 'Energy', path: '/energy' },
    { name: 'FAQ', path: '/energy' },
  ];

  const linkClass = ({ isActive }) =>
    `text-[14px] font-medium transition-colors hover:text-[#f06d00] ${
      isActive ? 'text-[#f06d00]' : 'text-[#2d333f]'
    }`;

  return (
    // Fixed to the viewport so it stays pinned while scrolling, floating on
    // top of the hero and all page content beneath it.
    <nav className="fixed top-0 sm:top-6 left-0 right-0 z-50 px-0 sm:px-4">
      <div className="max-w-6xl mx-auto bg-white sm:rounded-full shadow-lg h-16 grid grid-cols-2 lg:grid-cols-3 items-center pl-4 sm:pl-6 pr-2">

        {/* Logo Section (left) */}
        <div className="flex items-center">
          <Link to="/ ">
                <div className="">
                  <img
                    src={navlogo}
                    alt="Logo"
                    className="h-18 w-auto object-contain"
                  />
                </div>
              </Link>
        </div>

        {/* Navigation Links (centered, desktop only) */}
        <div className="hidden lg:flex items-center justify-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className={linkClass}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Side: desktop buttons + mobile hamburger */}
        <div className="flex items-center justify-end gap-2">
          {/* Desktop buttons */}
          {/* <button className="hidden lg:block bg-[#f06d00] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#d96200] transition-all">
            Get quotes
          </button> */}
          <Link to="login">
          <button className="hidden lg:block border border-gray-300 text-[#2d333f] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-all">
            Sign In
          </button>
          </Link>
          <Link to="signup">
          <button  className="hidden lg:block bg-[#f06d00] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#d96200] transition-all">
            Get Started
          </button>
          </Link>

          {/* Compact CTA always visible on small/medium screens */}
          <button className="lg:hidden bg-[#f06d00] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#d96200] transition-all">
            Get Started
          </button>

          {/* Hamburger toggle */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 text-[#2d333f] hover:text-[#f06d00] transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-2 sm:mx-auto bg-white sm:rounded-3xl shadow-lg flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                  isActive ? 'text-[#f06d00] bg-orange-50' : 'text-[#2d333f] hover:bg-gray-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="border-t border-gray-100 my-2" />

          <button className="border border-gray-300 text-[#2d333f] px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all text-left">
            For businesses
          </button>
          <button className="border border-gray-300 text-[#2d333f] px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all text-left">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;