import React from 'react'
import NavBar from '../navBar/NavBar'
import Footer from '../utility/Footer'

export const Layout = ({children}) => {
  return (
    <div>
        <NavBar/>
        {children}
        <Footer/>
    </div>
  )
}
