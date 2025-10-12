import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingNavbar from "./components/landing/Navbar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TestConnection from "./pages/TestConnection";

export default function AppContent() {
  const location = useLocation();
  const isLanding =
    location.pathname === "/" || location.pathname === "/landing";

  return (
    <>
      {isLanding ? <LandingNavbar /> : <Header />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test-connection" element={<TestConnection />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
