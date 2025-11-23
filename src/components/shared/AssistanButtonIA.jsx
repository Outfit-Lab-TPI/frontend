import { useEffect, useState } from "react";

export default function AssistanButtonIA({ setOpen }) {
    const [expanded, setExpanded] = useState(false);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        // función para alternar los estados
        const toggle = () => {
            setExpanded(true); // primero expandir

            // mostrar texto después de 300ms
            const textTimeout = setTimeout(() => {
                setShowText(prev => !prev);
            }, 300);

            // contraer después de 5000ms
            const collapseTimeout = setTimeout(() => {
                setExpanded(false); // contraer
            }, 5000);

            return () => {
                clearTimeout(textTimeout);
                clearTimeout(collapseTimeout);
            };
        };

        // iniciar loop
        toggle(); // primer toggle inmediato
        const interval = setInterval(toggle, 5000); // repetir cada 5s

        return () => clearInterval(interval);
    }, []);

    return (
        <button
            onClick={() => setOpen(true)}
            className={`
                bg-[#8F5D8D] text-white hover:text-[#1D1324]
                transition-all duration-200 hover:font-bold
                px-4 py-2 rounded-t-lg shadow-lg hover:bg-[#E3C18A]
                hover:cursor-pointer flex items-center gap-2
                overflow-hidden w-110 min-w-auto max-w-auto
            `}
        >
            <span className={`block transition-opacity duration-300`}>
                {showText
                    ? "Descubre sugerencias con un chatbot"
                    : "Asistente Outfitlab (IA)"}
            </span>
        </button>
    );
}
