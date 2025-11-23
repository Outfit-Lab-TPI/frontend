import { useState, useEffect } from 'react';
import { sugerenciasIAService } from '../services/sugerenciasIAService';
export function useRecomendacionAI(userId) {
  const [categories, setCategories] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  const [recommendations, setRecommendations] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState(null);

  useEffect(() => {
    if (!categories) {
      setLoadingCategories(true);
      sugerenciasIAService.obtenerCategoriasRecomendacion()
        .then(setCategories)
        .catch(err => {
          console.error("Error al cargar categorías de IA:", err);
          setErrorAI("Fallo al cargar categorías. El chat podría no ser preciso.");
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [categories]);

  const solicitarRecomendacionAI = async (peticionUsuario) => {
    if (!peticionUsuario.trim()) return;
    setLoadingAI(true);
    setErrorAI(null);
    setRecommendations(null);

     try {
        console.log("-> DISPARANDO LLAMADA A API CON USER ID:", userId);
        const results = await sugerenciasIAService.obtenerRecomendacionesPorTexto(
            userId,
            peticionUsuario
        );
      setRecommendations(results);
      return results;
    } catch (error) {
      console.error("Error al obtener recomendación de IA:", error);
      setErrorAI(error.message || "Error desconocido al procesar la petición.");
    } finally {
      setLoadingAI(false);
    }
  };

  const limpiarRecomendaciones = () => setRecommendations(null);

  return {
    categories,
    loadingCategories,
    recommendations,
    loadingAI,
    errorAI,
    solicitarRecomendacionAI,
    limpiarRecomendaciones,
  };
}