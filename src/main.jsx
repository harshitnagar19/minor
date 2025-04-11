import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import AboutUs from './component/aboutUs/AboutUs.jsx'
import Hero from './component/hero/Hero.jsx'
import Layout from './component/Layout.jsx'
import ContactUs from './component/contactUs/ContactUs.jsx'
import ScrollToTop from './component/ScrollToTop.js'

const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path='' element={<Layout />}>
      <Route path='/' element={<><ScrollToTop /><Hero /></>} />
      <Route path='/about-us' element={<><ScrollToTop /><AboutUs /></>} />
      <Route path='/contact-us' element={<><ScrollToTop /><ContactUs /></>} />
      x
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
