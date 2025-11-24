import apiClient from "./api.js";

export const combinacionService = {
  combinarPrendas: async (esHombre, top, bottom, usuario = null) => {
    // Determinar qué avatar usar basado en las preferencias del usuario
    let avatarType;
    let customAvatarUrl = null;

    if (usuario && usuario.avatarUrl) {
      // Si el usuario tiene una imagen personalizada, usarla
      avatarType = "custom";
      customAvatarUrl = usuario.avatarUrl;
    } else {
      // Si no hay imagen personalizada, usar avatar por defecto basado en preferencias o parámetro esHombre
      const generoPreferido =
        usuario?.avatarGenero || (esHombre ? "hombre" : "mujer");
      avatarType = generoPreferido === "hombre" ? "man" : "woman";
    }

    try {
      const requestData = {
        avatarType,
        top,
        bottom,
      };

      // TODO: Cuando se implemente el backend, agregar soporte para avatares personalizados
      // if (customAvatarUrl) {
      //   requestData.customAvatar = customAvatarUrl;
      // }

      const response = await apiClient.post(
        "/fashion/combinar-prendas",
        requestData,
        {
          timeout: 60000,
        }
      );
      return response.data;
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  },

  registerCombinationAttempt: async ({
    userEmail,
    prendaSupCode,
    prendaInfCode,
    marcaId,
    imageUrl,
  }) => {
    try {
      const response = await apiClient.post("/combinations/attempt/register", {
        userEmail,
        prendaSupCode,
        prendaInfCode,
        marcaId,
        imageUrl,
      });
      return response.data;
    } catch (error) {
      console.error("Error registrando intento:", error);
      throw error;
    }
  },
};
