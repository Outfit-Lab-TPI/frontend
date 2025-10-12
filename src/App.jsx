import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/auth/useAuth'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ErrorBoundary from './pages/errors/ErrorBoundary'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import NuevaPrenda from './pages/NuevaPrenda'
import NotFound from './pages/errors/NotFound'

function App() {
  return (
    <ErrorBoundary>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
