import React, { useState, useRef, useEffect } from 'react';
import { Send, Pencil, MessageSquare } from "lucide-react";

/**
 * Componente que maneja la interfaz de chat de recomendación de Outfits por IA.
 * @param {object} props
 * @param {object | null} props.categories
 * @param {boolean} props.loading 
 * @param {Array<Object> | null} props.recommendations
 * @param {string | null} props.error
 * @param {function} props.onSolicitar
 * @param {function} props.onSelectOutfit
 * @param {Array<Object>} props.conversationHistory 
 */
function RecommendationChat({ categories, loading, recommendations, error, onSolicitar, onSelectOutfit, conversationHistory }) {
    
    const [inputText, setInputText] = useState('');
    const [open, setOpen] = useState(false);
    
    const [isExpanded, setIsExpanded] = useState(false);
    const textareaRef = useRef(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const textToSubmit = inputText.trim();
        if (!textToSubmit) return;
        
        onSolicitar(textToSubmit);
        
        setInputText(''); 
        setIsExpanded(false);
    };

    const handleEditMessage = (text) => {
        setInputText(text);
        setOpen(true);
        setIsExpanded(true); 
        
        setTimeout(() => {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(text.length, text.length);
        }, 0);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputText, isExpanded]);

    const toggleChat = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const currentLoading = loading;
    
    const rowsCount = isExpanded ? 4 : 1; 
    const inputHeightClass = isExpanded ? 'min-h-[60px]' : 'min-h-[20px]';

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end max-w-full">

            <div
                className={`
                    bg-[#230636] rounded-lg shadow-2xl max-w-[90vw] transition-all duration-300 overflow-hidden p-3 mb-2 
                    ${open ? 'h-[50vh] opacity-100' : 'h-0 opacity-0 p-0 mb-0'}
                `}
                style={{
                    width: '450px' 
                }}
            >
                <div className="flex justify-between items-center px-2 py-2 border-b border-gray-700">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                        <MessageSquare size={20} className="text-purple-400" />
                        Asistente de Outfits
                    </h3>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition"
                        title="Cerrar"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="flex flex-col h-[calc(100%-48px)] px-1 pt-4 pb-1">
                
                    <div className="text-xs text-gray-400 mb-3 px-3">
                        {currentLoading && !categories
                            ? 'Cargando categorías iniciales...'
                            : 'Describe tu ocasión y clima (ej: casual para frío).'}
                    </div>
                        
                    <div className="flex-1 overflow-y-auto pr-2 mb-3 space-y-4 custom-scrollbar">
                        
                        {conversationHistory.map((message, index) => (
                            <div 
                                key={message.id || index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div 
                                    className={`
                                        max-w-[80%] p-3 rounded-xl break-words
                                        ${message.role === 'user' 
                                            ? 'bg-purple-600 text-white rounded-br-none cursor-pointer hover:bg-purple-700' 
                                            : message.role === 'error'
                                            ? 'bg-red-900/50 text-red-300 rounded-tl-none'
                                            : 'bg-gray-700 text-white rounded-tl-none'}
                                    `}
                                    onClick={() => message.role === 'user' && handleEditMessage(message.content)}
                                >
                                    {message.role === 'user' && (
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-sm pr-1">{message.content}</p> 
                                            <Pencil size={14} className="flex-shrink-0 opacity-70 mt-0.5" /> 
                                        </div>
                                    )}

                                    {message.role === 'ai' && (
                                        <div className="space-y-2">
                                            {message.content.length === 0 ? (
                                                <p className="text-sm text-white font-semibold"> 
                                                    Lo siento, no pude encontrar ningún outfit que coincida con esas categorías. Por favor, intenta con otra descripción.
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-green-400 font-semibold">
                                                        ¡Aquí tienes {message.content.length} opciones!
                                                    </p>
                                                    
                                                    {message.content.map((outfit, i) => (
                                                        <div
                                                            key={i}
                                                            className="bg-gray-600/70 p-2 rounded cursor-pointer hover:bg-gray-600 transition border border-gray-500"
                                                            onClick={() => onSelectOutfit(outfit)}
                                                        >
                                                            <p className="text-base font-medium mb-2">{outfit.nombre}</p>
                                                            
                                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                                {outfit.prendas
                                                                    .filter(p => p.imagenUrl)
                                                                    .map((prenda, pIndex) => (
                                                                        <div key={pIndex} className="relative aspect-square overflow-hidden rounded">
                                                                            <img
                                                                                src={prenda.imagenUrl}
                                                                                alt={prenda.nombre}
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => { e.target.onerror = null; e.target.src="/path/to/placeholder.png" }}
                                                                            />
                                                                            <span className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-1 py-0.5 rounded-tr truncate max-w-full">
                                                                                {prenda.nombre}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                            
                                                            <span className="text-xs text-yellow-500 mt-1 inline-block">
                                                                Click para probar
                                                            </span>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}
                                    
                                    {message.role === 'error' && (
                                        <div className="flex items-center">
                                            <span className="mr-2">😞</span>
                                            Error: {message.content}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {currentLoading && (
                            <div className="flex justify-start">
                                <p className="text-purple-400 text-sm p-3 bg-gray-700 rounded-xl rounded-tl-none">
                                    Buscando outfits...
                                </p>
                            </div>
                        )}

                        {!currentLoading && conversationHistory.length === 0 && !error && (
                            <p className="text-gray-500 text-sm px-3">
                                Ejemplo: "Quiero algo formal para un día frío".
                            </p>
                        )}
                        
                    </div>
                    
                    <form onSubmit={handleSubmit} className="flex gap-2 items-end px-3">
                        <textarea
                            ref={textareaRef} 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onFocus={() => setIsExpanded(true)}
                            onBlur={() => {
                                if (inputText.trim() === '') {
                                    setIsExpanded(false);
                                }
                            }}
                            placeholder="Describe el outfit..."
                            className={`
                                flex-grow p-2 rounded-lg bg-gray-700 text-white 
                                focus:outline-none resize-none overflow-hidden transition-all duration-200 
                                ${inputHeightClass}
                            `}
                            rows={rowsCount}
                            disabled={currentLoading}
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 text-white p-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 h-10 w-10 flex items-center justify-center transition-colors"
                            disabled={currentLoading || !inputText.trim()}
                        >
                            {currentLoading ? '...' : <Send size={20} strokeWidth={2} />}
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div 
                    className={`
                        bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg transition-opacity duration-300
                        ${open ? 'opacity-0 translate-x-3 pointer-events-none' : 'opacity-100 translate-x-0'}
                    `}
                >
                    Asistente de Outfits
                </div>

                <button
                    onClick={toggleChat}
                    className="
                        bg-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 
                        hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300/50 
                        flex items-center justify-center flex-shrink-0
                    "
                    title={open ? 'Minimizar Asistente' : 'Abrir Asistente'}
                >
                    <MessageSquare size={24} /> 
                </button>
            </div>
        </div>
    );
}

export default RecommendationChat;