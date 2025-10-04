import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TestConnection from "./pages/TestConnection";
import TripoTest from "./pages/TripoTest";
import GarmentGenerator from "./pages/GarmentGenerator";
import GarmentCalibrator from './pages/GarmentCalibrator';
import AvatarsShowroom from './pages/AvatarsShowroom';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test-connection" element={<TestConnection />} />
          <Route path="/tripo-test" element={<TripoTest />} />
          <Route path="/garment-generator" element={<GarmentGenerator />} />
          <Route path="/garment-calibrator" element={<GarmentCalibrator />} />
          <Route path="/avatars-showroom" element={<AvatarsShowroom />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
