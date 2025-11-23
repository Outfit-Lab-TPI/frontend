import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LandingNavbar from "./components/landing/Navbar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import BrandHome from "./pages/BrandHome";
import Profile from "./pages/Profile";
import Combinaciones from "./pages/Combinaciones";
import NotFound from "./pages/errors/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marcas from "./pages/Marcas";
import MarcaDetalle from "./pages/MarcaDetalle";
import SubscriptionPage from "./pages/Subscription";
import AdminDashboard from "./pages/AdminDashboard";
import PendingVerification from "./pages/PendingVerification";

import Unauthorized from "./pages/Unauthorized";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { RoleBasedRoute } from "./components/routing/RoleBasedRoute";

export default function AppContent() {
  const location = useLocation();
  const isLanding =
    location.pathname === "/" || location.pathname === "/landing";

  return (
    <>
      {isLanding ? <LandingNavbar /> : <Header />}

      <main className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pending-verification" element={<PendingVerification />} />

          {/* Rutas usuario */}
          <Route
            path="/home"
            element={
              <RoleBasedRoute allowedRoles={['USER']}>
                <Home />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/mis-combinaciones"
            element={
              <RoleBasedRoute allowedRoles={['USER']}>
                <Combinaciones />
              </RoleBasedRoute>
            }
          />

          {/* Rutas marca */}
          <Route
            path="/brand-home"
            element={
              <RoleBasedRoute allowedRoles={['BRAND']}>
                <BrandHome />
              </RoleBasedRoute>
            }
          />

          {/* Rutas admin */}
          <Route
            path="/dashboard"
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />

          {/* Rutas protegidas compartidas (accesibles por múltiples roles) */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marcas"
            element={
              <RoleBasedRoute allowedRoles={['USER', 'ADMIN']}>
                <Marcas />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/marcas/:codigoMarca"
            element={
              <RoleBasedRoute allowedRoles={['USER', 'ADMIN']}>
                <MarcaDetalle />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/suscripcion"
            element={
              <RoleBasedRoute allowedRoles={['USER', 'BRAND']}>
                <SubscriptionPage />
              </RoleBasedRoute>
            }
          />

          {/* Error routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {isLanding && <Footer />}
    </>
  );
}
