import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LandingNavbar from "./components/landing/Navbar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NotFound from "./pages/errors/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NuevaPrenda from "./pages/NuevaPrenda";

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
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/nueva-prenda" element={<NuevaPrenda />} />
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {isLanding && <Footer />}
    </>
  );
}
