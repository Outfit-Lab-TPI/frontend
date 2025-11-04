import { useState } from 'react';
import { combinacionService } from '../services/combinacionService.js';

export const useCombinacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);

  const combinarPrendas = async (isMan, prendaSuperior, prendaInferior, avatarType) => {
    // Set avatarType based on isMan if not provided
    if (!avatarType) {
      avatarType = isMan ? 'MAN' : 'WOMAN';
    }
    // Validaciones
    if (typeof isMan !== 'boolean') {
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

    if (!avatarType) {
      setError('El tipo de avatar debe ser especificado');
      return null;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const imageUrl = await combinacionService.combinarPrendas(
        prendaSuperior.imagenUrl,
        prendaInferior.imagenUrl,
        isMan,
        avatarType
      );

      setResultado({ imageUrl });
      return { imageUrl };
    } catch (err) {
      const errorMessage = err.message || 'Error al combinar las prendas';
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