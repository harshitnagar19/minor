import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import AboutUs from './component/aboutUs/AboutUs.jsx'
import Hero from './component/hero/Hero.jsx'
import Layout from './component/Layout.jsx'
import ContactUs from './component/contactUs/ContactUs.jsx'
import ScrollToTop from './component/ScrollToTop.js'
import PDFImageOperations from './component/operations/PDFImageOperations.jsx'
import { ImageCompressionUploader,  ImageEnhancementUI, ImageFormatConverter, ImageToPdfConverter } from './component/uploders/uploader.js';
import WordToPdfConverter from './component/uploders/WordToPdfConverter.jsx'
import PdfToWordConverter from './component/uploders/PdfToWordConverter.jsx'
import SplitPdfToImages from './component/uploders/SplitPdfToImages.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path='' element={<Layout />}>
      <Route path='/' element={<><ScrollToTop /><Hero /></>} />
      <Route path='/about-us' element={<><ScrollToTop /><AboutUs /></>} />
      <Route path='/contact-us' element={<><ScrollToTop /><ContactUs /></>} />
      <Route path='/dashboard' element={<><ScrollToTop /><PDFImageOperations /></>} />
      <Route path='/dashboard/image-compression-uploader' element={<><ScrollToTop /><ImageCompressionUploader/></>} />
      <Route path='/dashboard/image-enhancement' element={<><ScrollToTop /><ImageEnhancementUI/></>} />
      <Route path='/dashboard/image-to-pdf-converter' element={<><ScrollToTop /><ImageToPdfConverter/></>} />
      <Route path='/dashboard/image-format-converter' element={<><ScrollToTop/><ImageFormatConverter/></>}/>
      <Route path='/dashboard/word-to-pdf-convert' element={<><ScrollToTop/><WordToPdfConverter/></>}/>
      <Route path='/dashboard/pdf-to-word-convert' element={<><ScrollToTop/><PdfToWordConverter/></>}/>
      <Route path='/dashboard/split-pdf' element={<><ScrollToTop/><SplitPdfToImages/></>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
