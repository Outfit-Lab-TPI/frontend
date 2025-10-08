import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TestConnection from "./pages/TestConnection";
import ProbadorWrapper from "./pages/ProbadorWrapper";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/wardrobe" element={<ProbadorWrapper />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test-connection" element={<TestConnection />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
