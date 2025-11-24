import { useState } from "react";
import { combinacionService } from "../services/combinacionService.js";

export const useCombinacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [upgradeInfo, setUpgradeInfo] = useState(null);

  const combinarPrendas = async (
    avatarType,
    prendaSuperior,
    prendaInferior,
    usuario = null
  ) => {
    if (
      !validarCombinacion(avatarType, prendaSuperior, prendaInferior, usuario)
    )
      return null;

    setLoading(true);
    setError(null);
    setResultado(null);
    setUpgradeInfo(null);

    try {
      let response;

      response = await combinacionService.combinarPrendas(
        avatarType,
        prendaSuperior.imagenUrl,
        prendaInferior.imagenUrl,
        usuario
      );
      setResultado(response);

      // Si se usó fallback, mostrar mensaje informativo
      if (response.usedFallback && response.fallbackMessage) {
        // El error será más informativo que un error real
        setError(`ℹ️ ${response.fallbackMessage}`);
      }

      if (response) {
        try {
          await combinacionService.registerCombinationAttempt({
            userEmail: usuario?.email || null,
            prendaSupCode: prendaSuperior.garmentCode,
            prendaInfCode: prendaInferior.garmentCode,
            imageUrl: response.imageUrl,
          });
        } catch (error) {
          console.error("Error registrando intento de combinación:", error);
        }
      }

      return response;
    } catch (err) {
      let errorMessage;

      // Manejo explícito de 403 aunque no venga upgradeRequired
      if (err.response?.status === 403) {
        const data = err.response?.data || {};
        errorMessage =
          data.error ||
          data.message ||
          err.message ||
          'Has alcanzado el límite de tu plan';

        setUpgradeInfo({
          message: errorMessage,
          limitType: data.limitType || 'combinaciones',
          currentUsage: data.currentUsage,
          maxAllowed: data.maxAllowed
        });
        setError(errorMessage);
        return null;
      }

      if (err.upgradeRequired) {
        const { currentUsage, maxAllowed, limitType } = err;
        errorMessage = `${err.message || 'Límite alcanzado'} (${currentUsage}/${maxAllowed} ${limitType || ''})`;
        setError(errorMessage);
        setUpgradeInfo({
          message: err.message || 'Has alcanzado el límite de tu plan',
          limitType,
          currentUsage,
          maxAllowed
        });
        return null;
      }

      // Manejar errores específicos para avatares personalizados
      if (
        avatarType === "custom" &&
        (err.response?.status === 400 || err.response?.status === 404)
      ) {
        errorMessage =
          "No se pudo usar tu foto de perfil. Por favor, asegúrate de tener una imagen válida subida.";
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Error al combinar las prendas";
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validarCombinacion = (
    avatarType,
    prendaSuperior,
    prendaInferior,
    usuario
  ) => {
    if (!avatarType || !["man", "woman", "custom"].includes(avatarType)) {
      setError("El tipo de avatar debe ser especificado correctamente");
      return false;
    }

    // Validar que el usuario tenga foto si selecciona avatar personalizado
    if (avatarType === "custom" && !usuario?.userImg) {
      setError(
        "Debes tener una foto de perfil para usar esta opción. Por favor, sube una foto en tu perfil."
      );
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

    return true;
  };

  const limpiarResultado = () => {
    setResultado(null);
    setError(null);
    setUpgradeInfo(null);
  };

  const limpiarUpgrade = () => setUpgradeInfo(null);

  return {
    combinarPrendas,
    loading,
    error,
    resultado,
    limpiarResultado,
    setResultado,
    upgradeInfo,
    limpiarUpgrade,
  };
};
