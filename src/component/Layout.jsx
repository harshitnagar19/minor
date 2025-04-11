import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './navBar/NavBar';
import Footer from './utility/Footer';
import Loader from './loader/Loader'; // Make sure this path is correct

function Layout() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Duration of loader visibility

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <NavBar />
      {loading ? (
        <Loader />
      ) : (
        <Outlet />
      )}
      <Footer />
    </>
  );
}

export default Layout;
