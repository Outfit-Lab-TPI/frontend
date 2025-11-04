import { useState } from "react";
import { combinacionService } from "../services/combinacionService.js";

export const useCombinacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);

  const combinarPrendas = async (
    isMan,
    prendaSuperior,
    prendaInferior,
    avatarType
  ) => {
    // Set avatarType based on isMan if not provided
    if (!avatarType) {
      avatarType = isMan ? "MAN" : "WOMAN";
    }

    // Validaciones
    if (!validarParametros(isMan, prendaSuperior, prendaInferior, avatarType)) {
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
      const errorMessage = err.message || "Error al combinar las prendas";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validarParametros = (
    isMan,
    prendaSuperior,
    prendaInferior,
    avatarType
  ) => {
    if (typeof isMan !== "boolean") {
      setError("El tipo de avatar debe ser especificado");
      return false;
    }

    if (!prendaSuperior?.imagenUrl) {
      setError("Debe seleccionar una prenda superior");
      return false;
    }

    if (!prendaInferior?.imagenUrl) {
      setError("Debe seleccionar una prenda inferior");
      return false;
    }

    if (!avatarType) {
      setError("El tipo de avatar debe ser especificado");
      return false;
    }

    return true;
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
    limpiarResultado,
  };
};
