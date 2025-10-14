import { useState, useCallback } from 'react';
import { modelo3DService } from '../services/modelo3DService.js';

export const useModelo3D = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modeloUrl, setModeloUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generarModelo3D = useCallback(async (conjuntoUrl) => {
    // Validaciones
    if (!conjuntoUrl) {
      setError('URL del conjunto es requerida');
      return;
    }

    if (isGenerating) {
      return; // Evitar múltiples solicitudes simultáneas
    }

    try {
      setLoading(true);
      setIsGenerating(true);
      setError(null);

      const resultado = await modelo3DService.generarModelo(conjuntoUrl);

      if (resultado && resultado.modeloUrl) {
        setModeloUrl(resultado.modeloUrl);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('Error generando modelo 3D:', err);
      setError(err.message || 'Error al generar el modelo 3D');
      setModeloUrl(null);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  }, [isGenerating]);

  const limpiarModelo = useCallback(() => {
    setModeloUrl(null);
    setError(null);
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    modeloUrl,
    isGenerating,
    generarModelo3D,
    limpiarModelo,
    limpiarError
  };
};