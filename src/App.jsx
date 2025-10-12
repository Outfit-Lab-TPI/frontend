import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/auth/useAuth'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import NuevaPrenda from './pages/NuevaPrenda'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/nueva-prenda" element={<NuevaPrenda />} />
            <Route path="/" element={<Home />} />

          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
