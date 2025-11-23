import React, { useState } from 'react';

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
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl h-64 flex flex-col">
            <h3 className="text-white text-lg font-semibold mb-2 flex items-center">
                <span className="mr-2 text-yellow-400">✨</span> 
                Asistente de Outfits (IA)
            </h3>
            
            <div className="text-xs text-gray-400 mb-3">
                {loading && !categories
                    ? 'Cargando categorías iniciales...' 
                    : 'Describe tu ocasión y clima (ej: casual para frío).'}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 mb-3 space-y-2">
                
                {isLoadingRecommendation && <p className="text-purple-400 text-center">Buscando outfits...</p>}
                
                {error && (
                    <div className="bg-red-900/50 text-red-300 p-2 rounded flex items-center">
                        <span className="mr-2">😞</span> 
                        Error: {error}
                    </div>
                )}

                {recommendations && recommendations.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm text-green-400 font-semibold">¡Aquí tienes {recommendations.length} opciones!</p>
                        {recommendations.map((outfit, index) => (
                            <div key={index} 
                                 className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                                 onClick={() => handleSelect(outfit)}
                            >
                                <p className="text-white text-base font-medium">{outfit.nombre}</p>
                                
                                {outfit.prendas
                                    .filter(p => p.tipo?.toLowerCase() === 'superior' || p.tipo?.toLowerCase() === 'inferior')
                                    .map((prenda, pIndex) => (
                                        <p key={pIndex} className="text-xs text-gray-400">
                                            {prenda.tipo.toLowerCase() === 'superior' ? 'Top' : 'Bottom'}: {prenda.nombre}
                                        </p>
                                    ))}
                                
                                <span className="text-xs text-yellow-500 mt-1 inline-block">Click para probar</span>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !recommendations && !error && (
                    <p className="text-gray-500 text-sm">Ejemplo: "Quiero algo formal para un día frío".</p>
                )}
            </div>

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
                    {loading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
        </div>
    );
}

export default RecommendationChat;