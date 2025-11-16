import { useState } from "react";
import { Mailbox, Newspaper, Send } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"; 

const ThemedToast = () => (
    <ToastContainer 
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
    />
);


export default function ContactSection() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const BACKEND_URL = "http://localhost:8080/api/suscripcion/subscribe"; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "¡Gracias por suscribirte a OutfitLab!");
                setEmail("");
            } else {
                toast.error(data.error || "Error al suscribirse. Inténtalo más tarde.");
            }
        } catch (error) {
            console.error("Error de red:", error);
            toast.error("Error de conexión con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contacto" className="py-8">
            <div className="mx-auto px-2 sm:px-4 md:px-6">
                <div className="max-w-[750px] mx-auto">
                    <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/50 border border-[var(--secondary)]/30 rounded-2xl px-4 py-6 md:p-12 backdrop-blur-sm">
                        <div className="text-center space-y-4 mb-6">
                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-2">
                                <h2 className="!text-3xl md:!text-4xl font-heading text-[var(--white)]">
                                    Mantenete Conectado
                                </h2>
                                <Newspaper
                                    height={"fill"}
                                    className="hidden sm:inline size-6 text-[var(--white)]"
                                />
                            </div>
                            <p className="text-base sm:text-lg text-[var(--gray)] leading-relaxed">
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
                                    disabled={isLoading}
                                    className="flex-1 bg-[var(--black)]/50 border border-[var(--secondary)]/30 text-[var(--white)] placeholder:text-[var(--gray)] focus:border-[var(--secondary)] focus:outline-none h-12 !rounded-xl p-3 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[var(--white)]/10 cursor-pointer border border-[var(--tertiary)]/30 backdrop-blur-sm text-[var(--tertiary)] px-8 h-12 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--white)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--tertiary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            Enviar
                                            <Send className="ml-2 h-4 w-4" />
                                        </>
                                    )}
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