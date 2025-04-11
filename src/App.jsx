import { useState } from 'react'
import { BrowserRouter ,Routes , Route ,Router } from 'react-router-dom'
import LandingPage  from './component/landingPage/LandingPage'
import AboutUs from './component/aboutUs/AboutUs'
import NavBar from './component/navBar/NavBar'
import { Layout } from './component/layout/Layout'
import PDFImageOperations from './component/operations/PDFImageOperations'

function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route index element={<Layout><LandingPage></LandingPage></Layout>}></Route>
        <Route path='/about-us' element={<Layout><AboutUs/></Layout>}> </Route>
        <Route path='/ ' element={<Layout><PDFImageOperations/></Layout>}> </Route>
        
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

