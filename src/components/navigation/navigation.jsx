import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // íconos del menú

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // cerrar menú al hacer clic en un enlace
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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

        <div className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("inicio")}
            className="text-[#fffcf5]/70 hover:text-[#e3c18a] transition-colors text-sm font-medium"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection("beneficios")}
            className="text-[#fffcf5]/70 hover:text-[#e3c18a] transition-colors text-sm font-medium"
          >
            Beneficios
          </button>
          <button
            onClick={() => scrollToSection("contacto")}
            className="text-[#fffcf5]/70 hover:text-[#e3c18a] transition-colors text-sm font-medium"
          >
            Contacto
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button className="border border-[#926490] text-[#fffcf5] hover:bg-[#926490]/10 px-4 py-2 rounded-full transition-all duration-300 font-semibold">
            Ingresar
          </button>
          <button className="bg-gradient-to-r from-[#926490] to-[#b078b0] text-[#fffcf5] px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold">
            Registrarse
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-[#fffcf5] focus:outline-none z-200"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`lg:hidden fixed top-0 left-0 w-full bg-[#0a050e]/95 backdrop-blur-md border-b border-[#926490]/20 transform transition-all duration-500 ease-out ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center py-6 space-y-5">
          <button
            onClick={() => scrollToSection("inicio")}
            className="hover-pointer text-[#fffcf5]/80 hover:text-[#e3c18a] text-lg font-medium"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection("beneficios")}
            className="hover-pointer text-[#fffcf5]/80 hover:text-[#e3c18a] text-lg font-medium"
          >
            Beneficios
          </button>
          <button
            onClick={() => scrollToSection("contacto")}
            className="hover-pointer text-[#fffcf5]/80 hover:text-[#e3c18a] text-lg font-medium"
          >
            Contacto
          </button>
          <div className="flex flex-col gap-3 pt-2">
            <button className="hover-pointer border border-[#926490] text-[#fffcf5] hover:bg-[#926490]/10 px-6 py-2 rounded-full font-semibold transition-all duration-300">
              Ingresar
            </button>
            <button className="hover-pointer bg-gradient-to-r from-[#926490] to-[#b078b0] text-[#fffcf5] px-6 py-2 rounded-full shadow-md hover:shadow-lg font-semibold transition-all duration-300">
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
