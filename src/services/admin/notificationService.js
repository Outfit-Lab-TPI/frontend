// src/services/notificationService.js
import apiClient from "../api.js";

export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await apiClient.get("/marcas/notifications-new-brands");
      // EXTRAER EL ARRAY notifications
      return Array.isArray(response.data.notifications) ? response.data.notifications : [];
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al obtener notificaciones"
      );
    }
  },

  approveBrand: async (codigoMarca) => {
    try {
      const response = await apiClient.patch(`/marcas/activate/${codigoMarca}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al marcar notificación"
      );
    }
  },
};
