import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Profile from "./pages/Profile"
import TestConnection from "./pages/TestConnection"
import Landing from "./pages/landing/landing"

function App() {
  return (
    <BrowserRouter>
    
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test-connection" element={<TestConnection />} />
          <Route path="/landing" element={<Landing />} />
        </Routes>
      </main>
      
    </BrowserRouter>
  )
}

export default App
