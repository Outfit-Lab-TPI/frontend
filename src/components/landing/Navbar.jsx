import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const pages = [
  { name: "Inicio", id: "inicio" },
  { name: "Beneficios", id: "beneficios" },
  { name: "Cómo funciona", id: "comoFunciona" },
  { name: "Contacto", id: "contacto" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 20);

      if (currentScroll > lastScroll && currentScroll > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    const navbar = document.querySelector("nav");
    if (element && navbar) {
      const offset = -navbar.offsetHeight;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setMenuOpen(false);
      setHidden(true);
      setTimeout(() => setHidden(false), 800);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-[#0a050e]/80 backdrop-blur-md border-b border-[#926490]/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => scrollToSection("inicio")}
        >
          <img src="/isologo.svg" className="w-28 h-10" alt="logo" />
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {pages.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="tracking-widest text-[var(--white)]/70 hover:text-[#e3c18a] transition-colors text-sm font-medium"
            >
              {name}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="tracking-widest text-[var(--white)] hover:bg-[#926490]/10 px-4 py-2 rounded-full transition-all duration-300 font-semibold"
          >
            Ingresar
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="tracking-widest text-[var(--white)] hover:bg-[#926490]/10 px-4 py-2 rounded-full transition-all duration-300 font-semibold"
          >
            Registrarse
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-[var(--white)] focus:outline-none z-200"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú móvil */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full bg-[#0a050e]/95 backdrop-blur-md border-b border-[#926490]/20 transform transition-all duration-500 ease-out ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center py-6 space-y-5">
          {pages.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="tracking-widest hover-pointer text-[var(--white)]/80 hover:text-[#e3c18a] text-lg font-medium"
            >
              {name}
            </button>
          ))}
          <div className="flex flex-col gap-4 pt-6">
            <button
              onClick={() => navigate("/login")}
              className="tracking-widest hover-pointer text-[var(--white)] hover:bg-[#926490]/10 px-6 py-2 rounded-full font-semibold transition-all duration-300"
            >
              Ingresar
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="tracking-widest hover-pointer text-[var(--white)] hover:bg-[#926490]/10 px-6 py-2 rounded-full font-semibold transition-all duration-300"
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
