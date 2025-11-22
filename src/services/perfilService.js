import apiClient from './api.js';
import { fetchMockCombinacionesFavoritas } from '../utils/mockData.js';

// Configuración para usar mock data temporalmente
const USE_MOCK_DATA = false;

const isCriticalError = (error) => {
  // Errores de servidor 5xx
  if (error.response && error.response.status >= 500) return true;

  // Sin respuesta del servidor
  if (error.request && !error.response) return true;

  return false;
};

const validarFormDataPerfil = (formData) => {
  if (!formData.has('name')) {
    throw new Error('FormData debe contener name');
  }
  if (!formData.has('email')) {
    throw new Error('FormData debe contener email');
  }
};

export const perfilService = {
  // Obtener perfil del usuario
  obtenerPerfil: async (userId) => {
    try {
      // TODO: Implementar endpoint para obtener perfil
      // const response = await apiClient.get(`/api/perfil/${userId}`);
      // return response.data;

      // Simulación temporal
      return {
        data: {
          user: {
            id: userId,
            name: 'Usuario Mock',
            email: 'usuario@example.com',
            avatarUrl: null,
            avatarGenero: 'hombre', // Preferencia por defecto
            createdAt: new Date().toISOString()
          }
        }
      };
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener el perfil'
      );
    }
  },

  // Actualizar perfil del usuario
  actualizarPerfil: async (userId, formData) => {
    try {
      validarFormDataPerfil(formData);

      // TODO: Implementar endpoint para actualizar perfil
      const response = await apiClient.put(`/users/update/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;

      // Simulación temporal
      console.log('Actualizando perfil en servicio:', { userId, formData });

      // Simular respuesta del backend
      return {
        data: {
          user: {
            id: userId,
            name: formData.get('name'),
            email: formData.get('email'),
            avatarUrl: formData.has('avatar') ? `/uploads/avatars/${userId}.jpg` : null,
            avatarGenero: formData.get('avatarGenero') || 'hombre',
            updatedAt: new Date().toISOString()
          }
        }
      };
    } catch (error) {
      error.isCritical = isCriticalError(error);
      console.error('Error en perfilService.actualizarPerfil:', error);

      // Manejar errores específicos del perfil
      if (error.response?.status === 409) {
        throw new Error('Este email ya está en uso por otra cuenta');
      } else if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 400) {
        throw new Error('Datos inválidos. Revisa los campos y vuelve a intentar.');
      }

      // Para otros errores, usar mensaje del servidor o genérico
      throw new Error(
        error.response?.data?.message || 'Error al actualizar el perfil'
      );
    }
  },

  // Subir/actualizar avatar del usuario
  subirAvatar: async (userId, avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      // TODO: Implementar endpoint para subir avatar
      // const response = await apiClient.post(`/api/perfil/${userId}/avatar`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // return response.data;

      // Simulación temporal
      console.log('Subiendo avatar en servicio:', { userId, avatarFile });

      return {
        data: {
          avatarUrl: `/uploads/avatars/${userId}_${Date.now()}.jpg`,
          message: 'Avatar subido exitosamente'
        }
      };
    } catch (error) {
      error.isCritical = isCriticalError(error);
      console.error('Error en perfilService.subirAvatar:', error);
      throw new Error(
        error.response?.data?.message || 'Error al subir el avatar'
      );
    }
  },

  // Eliminar avatar del usuario
  eliminarAvatar: async (userId) => {
    try {
      // TODO: Implementar endpoint para eliminar avatar
      // const response = await apiClient.delete(`/api/perfil/${userId}/avatar`);
      // return response.data;

      // Simulación temporal
      console.log('Eliminando avatar en servicio:', { userId });

      return {
        data: {
          message: 'Avatar eliminado exitosamente'
        }
      };
    } catch (error) {
      error.isCritical = isCriticalError(error);
      console.error('Error en perfilService.eliminarAvatar:', error);
      throw new Error(
        error.response?.data?.message || 'Error al eliminar el avatar'
      );
    }
  },

  // Cambiar contraseña del usuario
  cambiarContrasena: async (userId, passwordData) => {
    try {
      // TODO: Implementar endpoint para cambiar contraseña
      // const response = await apiClient.post(`/api/perfil/${userId}/password`, {
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });
      // return response.data;

      // Simulación temporal
      console.log('Cambiando contraseña en servicio:', { userId });

      return {
        data: {
          message: 'Contraseña cambiada exitosamente'
        }
      };
    } catch (error) {
      error.isCritical = isCriticalError(error);
      console.error('Error en perfilService.cambiarContrasena:', error);
      throw new Error(
        error.response?.data?.message || 'Error al cambiar la contraseña'
      );
    }
  },

  // Obtener configuraciones del usuario
  obtenerConfiguraciones: async (userId) => {
    try {
      // TODO: Implementar endpoint para obtener configuraciones
      // const response = await apiClient.get(`/api/perfil/${userId}/configuraciones`);
      // return response.data;

      // Simulación temporal
      return {
        data: {
          notificaciones: true,
          privacidad: 'publico',
          tema: 'oscuro',
          idioma: 'es'
        }
      };
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener las configuraciones'
      );
    }
  },

  // Actualizar configuraciones del usuario
  actualizarConfiguraciones: async (userId, configuraciones) => {
    try {
      // TODO: Implementar endpoint para actualizar configuraciones
      // const response = await apiClient.put(`/api/perfil/${userId}/configuraciones`, configuraciones);
      // return response.data;

      // Simulación temporal
      console.log('Actualizando configuraciones en servicio:', { userId, configuraciones });

      return {
        data: {
          ...configuraciones,
          message: 'Configuraciones actualizadas exitosamente'
        }
      };
    } catch (error) {
      error.isCritical = isCriticalError(error);
      console.error('Error en perfilService.actualizarConfiguraciones:', error);
      throw error;
    }
  },

  // Funcionalidad existente para combinaciones favoritas
  obtenerCombinacionesFavoritas: async () => {
    try {
      if (USE_MOCK_DATA) {
        return await fetchMockCombinacionesFavoritas();
      }

      // TODO: Implementar endpoint para obtener combinaciones favoritas
      // const response = await apiClient.get('/api/perfil/combinaciones');
      // return response.data;

      // Simulación temporal
      return {
        data: {
          combinaciones: [],
          message: 'Combinaciones favoritas obtenidas exitosamente'
        }
      };
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw new Error(
        error.response?.data?.message ||
        'Error al obtener las combinaciones favoritas'
      );
    }
  }
};