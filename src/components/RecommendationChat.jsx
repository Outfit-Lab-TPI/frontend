import React, { useState } from 'react';
import AssistanButtonIA from "../components/shared/AssistanButtonIA";
import { Send } from "lucide-react";

/**
 * Componente que maneja la interfaz de chat de recomendación de Outfits por IA.
 * * @param {object} props
 * @param {object | null} props.categories
 * @param {boolean} props.loading 
 * @param {Array<Object> | null} props.recommendations
 * @param {string | null} props.error
 * @param {function} props.onSolicitar
 * @param {function} props.onSelectOutfit
 */
function RecommendationChat({ categories, loading, recommendations, error, onSolicitar, onSelectOutfit }) {
    const [inputText, setInputText] = useState('');
    const [open, setOpen] = useState(false); // <-- agregado solo para UI

    const handleSubmit = (e) => {
        e.preventDefault();
        const textToSubmit = inputText.trim();
        if (!textToSubmit) return;
        setInputText('');
        onSolicitar(textToSubmit);
    };

    const handleSelect = (outfit) => {
        onSelectOutfit(outfit);
    };

    const isLoadingRecommendation = loading && recommendations === null;

    return (
        <div className="fixed bottom-4 right-4 z-50">

            {/* ---- BOTÓN TIPO "REDACTAR" DE GMAIL ---- */}
            {!open && (
                /*<button
                    onClick={() => setOpen(true)}
                    className="bg-[#8F5D8D] text-white hover:text-[#1D1324] transition-all duration-150 hover:font-bold px-4 py-2 rounded-t-lg shadow-lg hover:bg-[#E3C18A] hover:cursor-pointer flex items-center gap-2"
                >
                    Asistente Outfitlab (IA)
                </button>*/
                <AssistanButtonIA setOpen={setOpen} />
            )}

           {/* ---- PANEL EXPANDIBLE ---- */}
            <div
                className={`
                    bg-[#230636] rounded-lg shadow-2xl w-110 transition-all duration-300 overflow-hidden p-3
                    ${open ? 'h-[50vh] sm:h-[50vh] md:h-[50vh] lg:h-[50vh] xl:h-[50vh] opacity-100' : 'h-0 opacity-0'}
                `}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                    <h3 className="text-white font-semibold text-lg">Asistente de Outfits</h3>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>
                
                {/* Contenido principal */}
                <div className="flex flex-col h-[calc(100%-48px)] p-4">
                
                    <div className="text-xs text-gray-400 mb-3">
                        {loading && !categories
                            ? 'Cargando categorías iniciales...'
                            : 'Describe tu ocasión y clima (ej: casual para frío).'}
                    </div>
                        
                    <div className="flex-1 overflow-y-auto pr-2 mb-3 space-y-2">
                        {isLoadingRecommendation && (
                            <p className="text-purple-400 text-center">Buscando outfits...</p>
                        )}

                        {error && (
                            <div className="bg-red-900/50 text-red-300 p-2 rounded flex items-center">
                                <span className="mr-2">😞</span>
                                Error: {error}
                            </div>
                        )}

                        {recommendations && recommendations.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm text-green-400 font-semibold">
                                    ¡Aquí tienes {recommendations.length} opciones!
                                </p>
                        
                                {recommendations.map((outfit, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                                        onClick={() => handleSelect(outfit)}
                                    >
                                        <p className="text-white text-base font-medium">
                                            {outfit.nombre}
                                        </p>
                                
                                        {outfit.prendas
                                            .filter(p =>
                                                p.tipo?.toLowerCase() === 'superior' ||
                                                p.tipo?.toLowerCase() === 'inferior'
                                            )
                                            .map((prenda, pIndex) => (
                                                <p key={pIndex} className="text-xs text-gray-400">
                                                    {prenda.tipo.toLowerCase() === 'superior'
                                                        ? 'Top'
                                                        : 'Bottom'}:{' '}
                                                    {prenda.nombre}
                                                </p>
                                            ))}

                                        <span className="text-xs text-yellow-500 mt-1 inline-block">
                                            Click para probar
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && !recommendations && !error && (
                            <p className="text-gray-500 text-sm">
                                Ejemplo: "Quiero algo formal para un día frío".
                            </p>
                        )}
                    </div>
                    
                    {/* Input */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Describe el outfit..."
                            className="flex-grow p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 text-white p-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
                            disabled={loading || !inputText.trim()}
                        >
                            {loading ? 
                                    '...' :         
                                    <Send size={20} strokeWidth={2} />}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default RecommendationChat;
