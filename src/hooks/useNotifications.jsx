// src/hooks/useNotifications.jsx
import { useState, useEffect } from "react";
import { notificationService } from "../services/notificationService.js";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Función para traer notificaciones
  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data); // mantiene tu lógica actual
    } catch (err) {
      console.error(err.message);
      setNotifications([]);
    }
  };

  // Fetch inicial
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Aprobar marca
  const approveBrand = async (codigoMarca) => {
    try {
      await notificationService.approveBrand(codigoMarca);
      // OPCIONAL: efecto inmediato local
      setNotifications((prev) =>
        prev.filter((n) => n.brand.codigoMarca !== codigoMarca)
      );
      // REFRESH desde backend para mantener consistencia
      await fetchNotifications();
    } catch (err) {
      console.error(err.message);
    }
  };

  return { notifications, approveBrand, fetchNotifications };
};
