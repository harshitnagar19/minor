import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../assets/Logo.png";
import { useLocation, useNavigate } from 'react-router-dom';


const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [getStartShow, setGetstartShow] = useState(true)
  let loc = useLocation();
  useEffect(() => {
    console.log(loc)
    if (loc.pathname == '/dashboard') {
      setGetstartShow(false);

    } else {
      setGetstartShow(true);
    }
  }, [loc])
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const location = useLocation();

  // Scrolling to top when logo is clicked
  const handleHeroClick = () => {
    if (location.pathname === '/') {
      // Already on home page - scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // On different page - navigate to home
      navigate('/');
      // Optional: Scroll to top after navigation completes
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);
    }
  };

  //Handle click of about us page on mobile screens
  const handleAboutClick = () => {
    if (location.pathname === '/about-us') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/about-us')
    }
  }
  const handleContactClick = () => {
    if (location.pathname === '/contact-us') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/contact-us')
    }
  }
  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-opacity-90 backdrop-blur-sm z-50 shadow-lg border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center border border-gray-700/50">
            <button onClick={handleHeroClick}>
              <img src={logo} alt="Logo" className="h-10 sm:h-12 rounded-sm" />
            </button>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={({ isActive }) => `hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-[#4f39f6]" : "text-white"}`}
              >
                HeroSection
              </NavLink>
              <NavLink
                to="/about-us"
                onClick={(e) => {
                  if (location.pathname === '/about-us') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={({ isActive }) => `hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-[#4f39f6]" : "text-white"}`}
              >
                About US
              </NavLink>
              <NavLink to="/contact-us"
                onClick={(e) => {
                  if (location.pathname === '/contact-us') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={({ isActive }) => `hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "text-[#4f39f6]" : "text-white"}`} > Contact Us</NavLink>
              <Link to="#pricing" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Other</Link>
            </div>
          </div>

          <div className={`hidden md:block`}>
            <button className={`${getStartShow ? "md:block hidden" : "hidden"} bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200`}
              onClick={() => { navigate("/dashboard") }}
            >
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="md:hidden overflow-hidden"
          >
            <motion.div
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#12192b] shadow-lg"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                },
                hidden: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
            >
              <motion.div variants={itemVariants}>
                <NavLink
                  to="/"
                  onClick={()=>{
                    toggleMenu();
                    handleHeroClick();
                  }}
                  className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-[#4f39f6]" : "text-white"}`}
                >
                  HeroSection
                </NavLink>
              </motion.div>
              <motion.div variants={itemVariants}>
                <NavLink
                  to="/about-us"
                  onClick={() => {
                    toggleMenu();
                    handleAboutClick();
                  }}
                  className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-[#4f39f6]" : "text-white"}`}
                >
                  About Us
                </NavLink>
              </motion.div>
              <motion.div variants={itemVariants}>
                <NavLink
                  to="/contact-us"
                  onClick={() => {
                    toggleMenu();
                    handleContactClick();
                  }}
                  className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-[#4f39f6]" : "text-white"}`}
                >
                  Contact Us
                </NavLink>
              </motion.div>
              <motion.div variants={itemVariants}>
                <NavLink
                  to="/other"
                  onClick={toggleMenu}
                  className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-[#4f39f6]" : "text-white"}`}
                >
                  Other
                </NavLink>
              </motion.div>
              <motion.div variants={itemVariants} className="mt-4">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
                  Get Started
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;