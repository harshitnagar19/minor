import { useState } from 'react'
import { BrowserRouter ,Routes , Route } from 'react-router-dom'
import LandingPage  from './component/landingPage/LandingPage'

function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage></LandingPage>}> </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
