import { useState } from 'react';
import { combinacionService } from '../services/combinacionService.js';

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

      response = await combinacionService.combinarPrendas(
        esHombre,
        prendaSuperior.imagenUrl,
        prendaInferior.imagenUrl
      );

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