import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from "../../assets/Logo.png";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[] bg-opacity-90 backdrop-blur-sm z-50 shadow-lg border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center  border border-gray-700/50">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-10 sm:h-12 rounded-sm" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={({ isActive }) => `hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-[#4f39f6]" : "text-white"}`}
              >HeroSection
              </NavLink>
              <NavLink
                to="/about-us"
                className={({ isActive }) => `hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-[#4f39f6]" : "text-white"}`
                }
              >
                About US
              </NavLink>
              <Link to="#contact" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact Us</Link>
              <Link to="#pricing" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Kuch dena hoto</Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link to="/" className="">HeroSection</Link>
          <NavLink to="/" className={({ isActive }) => `hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-[#4f39f6]" : "text-white"}`}
              >HeroSection
          </NavLink>
          <NavLink to="/about-us" className={({ isActive }) => `hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-[#4f39f6]" : "text-white"}`}
              >About Us
          </NavLink>
          <Link to="#contact" className="text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Contact Us</Link>
          <Link to="#pricing" className="text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Kuch dena hoto</Link>
          <div className="mt-4">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;