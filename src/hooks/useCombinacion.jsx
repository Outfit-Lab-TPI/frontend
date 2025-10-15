import { useState } from 'react';
import { combinacionService } from '../services/combinacionService.js';

// Configuración para usar mock data temporalmente
const USE_MOCK_DATA = false;

// Mock URLs de ejemplo para las combinaciones
const MOCK_OUTFIT_URLS = [
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=600&fit=crop'
];

export const useCombinacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);

  const combinarPrendas = async (esHombre, prendaSuperior, prendaInferior) => {
    // Validaciones
    if (typeof esHombre !== 'boolean') {
      setError('El tipo de avatar debe ser especificado');
      return null;
    }

    if (!prendaSuperior?.imagenUrl) {
      setError('Debe seleccionar una prenda superior');
      return null;
    }

    if (!prendaInferior?.imagenUrl) {
      setError('Debe seleccionar una prenda inferior');
      return null;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      let response;

      if (USE_MOCK_DATA) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Seleccionar una imagen aleatoria basada en el tipo de avatar
        const randomIndex = Math.floor(Math.random() * MOCK_OUTFIT_URLS.length);
        response = MOCK_OUTFIT_URLS[randomIndex];

        console.log('Mock combination:', {
          esHombre,
          superior: prendaSuperior.imagenUrl,
          inferior: prendaInferior.imagenUrl,
          resultado: response
        });
      } else {
        response = await combinacionService.combinarPrendas(
          esHombre,
          prendaSuperior.imagenUrl,
          prendaInferior.imagenUrl
        );
      }

      setResultado(response);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Error al combinar las prendas';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const limpiarResultado = () => {
    setResultado(null);
    setError(null);
  };

  return {
    combinarPrendas,
    loading,
    error,
    resultado,
    limpiarResultado
  };
};