import apiClient from './api.js';

const buildUpgradeError = (error) => {
  const data = error.response?.data || {};
  if (error.response?.status === 403 && data.upgradeRequired) {
    const err = new Error(data.error || 'Has alcanzado el límite de tu plan');
    err.upgradeRequired = true;
    err.limitType = data.limitType;
    err.currentUsage = data.currentUsage;
    err.maxAllowed = data.maxAllowed;
    return err;
  }
  return null;
};

export const combinacionService = {
  combinarPrendas: async (avatarType, top, bottom, usuario = null) => {
    let customAvatarUrl = null;

    // Si es custom, incluir la URL del avatar personalizado
    if (avatarType === 'custom' && usuario?.avatarUrl) {
      customAvatarUrl = usuario.avatarUrl;
    }

    try {
      const requestData = {
        avatarType,
        top,
        bottom
      };

      // Incluir avatar personalizado si aplica
      if (customAvatarUrl) {
        requestData.customAvatar = customAvatarUrl;
      }

      const response = await apiClient.post('/fashion/combinar-prendas', requestData, {
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      const upgradeError = buildUpgradeError(error);
      if (upgradeError) throw upgradeError;

      console.error("Error en combinacionService:", error);

      // Manejo específico de errores relacionados con avatar custom
      if (error.response?.status === 400 || error.response?.status === 404) {
        if (avatarType === 'custom') {
          // Si el error es con avatar personalizado, intentar con fallback
          console.warn('Avatar personalizado falló, intentando con fallback...');

          try {
            // Determinar avatar por defecto basado en preferencias del usuario
            const fallbackAvatarType = usuario?.avatarGenero === 'mujer' ? 'woman' : 'man';

            const fallbackRequestData = {
              avatarType: fallbackAvatarType,
              top,
              bottom
            };

            const fallbackResponse = await apiClient.post('/fashion/combinar-prendas', fallbackRequestData, {
              timeout: 60000
            });

            // Agregar información sobre el fallback en la respuesta
            return {
              ...fallbackResponse.data,
              usedFallback: true,
              fallbackMessage: 'No se pudo usar tu foto, se usó avatar por defecto'
            };
          } catch (fallbackError) {
            console.error("Error en fallback:", fallbackError);
            throw new Error('Error al procesar la combinación. Verifica tu conexión e intenta nuevamente.');
          }
        }
      }

      // Para otros errores, lanzar el error original
      throw error;
    }
  }
};
