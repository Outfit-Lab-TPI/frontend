import { useState, useEffect } from 'react';
import { sugerenciasIAService } from '../../services/probador/sugerenciasIAService';
export function useRecomendacionAI(userId) {
  const [categories, setCategories] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // 🛑 NUEVO ESTADO PARA ALMACENAR EL HISTORIAL DE CHAT
  const [conversationHistory, setConversationHistory] = useState([]);
    
  const [recommendations, setRecommendations] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState(null);

  useEffect(() => {
    // ... (Lógica para cargar categorías) ...
  }, [categories]);

  const solicitarRecomendacionAI = async (peticionUsuario) => {
    if (!peticionUsuario.trim()) return;
    
    // 🛑 1. AGREGAR EL MENSAJE DEL USUARIO AL HISTORIAL INMEDIATAMENTE
    setConversationHistory(prev => [
      ...prev,
      { role: 'user', content: peticionUsuario, id: Date.now() }
    ]);
    
    setLoadingAI(true);
    setErrorAI(null);
    setRecommendations(null);

     try {
        const results = await sugerenciasIAService.obtenerRecomendacionesPorTexto(
            userId,
            peticionUsuario
        );
      
      // 🛑 2. AGREGAR LA RESPUESTA DE LA IA AL HISTORIAL
      setConversationHistory(prev => [
        ...prev,
        { role: 'ai', content: results, id: Date.now() + 1, originalQuery: peticionUsuario }
      ]);
      
      setRecommendations(results);
      return results;
    } catch (error) {
        console.error("Error al obtener recomendación de IA:", error);
        setErrorAI(error.message || "Error desconocido al procesar la petición.");
        
        // 🛑 3. AGREGAR EL ERROR AL HISTORIAL (Opcional, para mostrarlo en el chat)
        setConversationHistory(prev => [
          ...prev,
          { role: 'error', content: error.message || "Error al procesar la petición.", id: Date.now() + 2 }
        ]);
    } finally {
      setLoadingAI(false);
    }
  };

  const limpiarRecomendaciones = () => {
    setRecommendations(null);
    // 🛑 4. Limpiar historial si es necesario, o solo las recomendaciones
    // setConversationHistory([]); 
  };

  return {
    categories,
    loadingCategories,
    recommendations,
    loadingAI,
    errorAI,
    solicitarRecomendacionAI,
    limpiarRecomendaciones,
    // 🛑 EXPORTAR EL NUEVO ESTADO
    conversationHistory,
  };
}