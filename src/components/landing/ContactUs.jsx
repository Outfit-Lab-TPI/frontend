import React, { useState } from "react";
import { Send, Download } from "lucide-react";
import { toast } from "react-toastify";
import ThemedToast from "../ui/ThemedToast";
import ErrorToast from "../ui/ErrorToast";
import { patterns } from "../../utils/validations";

export default function ContactSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;
    if (!validateEmail(email)) return;

    setEmail("");
    toast.success("¡Gracias por suscribirte!");
  };

  const handleDownload = () => {
    const stored = JSON.parse(localStorage.getItem("emails") || "[]");
    const blob = new Blob([JSON.stringify(stored, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emails.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="contacto" className="py-8 relative">
      <div className="container mx-auto px-3 md:px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/50 border border-[var(--secondary)]/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="text-center space-y-4 mb-8">
              <h2 className="!text-3xl md:!text-4xl font-heading text-[var(--white)]">
                MANTENETE CONECTADO
              </h2>
              <p className="text-lg text-[var(--gray)] leading-relaxed">
                Sé el primero en conocer nuestras novedades y actualizaciones.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 max-w-[600px] mx-auto">
                <input
                  type="email"
                  placeholder="Ingresa aquí tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-[var(--black)]/50 border border-[var(--secondary)]/30 text-[var(--white)] placeholder:text-[var(--gray)] focus:border-[var(--secondary)] focus:outline-none h-12 !rounded-xl p-3"
                />
                <button
                  type="submit"
                  className="bg-[var(--white)]/10 cursor-pointer border border-[var(--tertiary)]/30 backdrop-blur-sm text-[var(--tertiary)] px-8 h-12 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--white)]/20"
                >
                  Enviar
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </div>

              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="text-sm text-[var(--white)] underline hover:text-[var(--gray)] cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300 px-3"
                >
                  <Download className="inline ml-1 size-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[var(--gray)] text-center italic">
                Al suscribirte, aceptas recibir actualizaciones sobre nuestro
                probador virtual.
              </p>
            </form>
          </div>
        </div>
      </div>
      <ThemedToast />
    </section>
  );
}

const validateEmail = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const stored = JSON.parse(localStorage.getItem("emails") || "[]");

  if (!patterns.email.test(normalizedEmail)) {
    ErrorToast("Por favor, ingrese un correo válido");
    return false;
  }

  if (stored.includes(normalizedEmail)) {
    ErrorToast("Este correo ya se encuentra registrado");
    return false;
  }

  stored.push(normalizedEmail);
  localStorage.setItem("emails", JSON.stringify(stored));
  return true;
};
