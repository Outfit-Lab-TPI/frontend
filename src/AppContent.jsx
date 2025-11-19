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

export default function AppContent() {
  const location = useLocation();
  const isLanding =
    location.pathname === "/" || location.pathname === "/landing";

  return (
    <>
      {isLanding ? <LandingNavbar /> : <Header />}

      <main className="main-content">
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/brand-home" element={<BrandHome />} />
          <Route path="/mis-combinaciones" element={<Combinaciones />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/marcas/:codigoMarca" element={<MarcaDetalle />} />
          <Route path="/suscripcion" element={<SubscriptionPage />} />
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {isLanding && <Footer />}
    </>
  );
}
