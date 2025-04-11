import React from 'react'
import NavBar from './navBar/NavBar'
import Footer from './utility/Footer'
import { Outlet } from 'react-router-dom'
function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  )
}
export default Layout;