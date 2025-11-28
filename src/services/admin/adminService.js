import apiClient from '../api.js';

const isCriticalError = (error) => {
  // Errores de servidor 5xx
  if (error.response && error.response.status >= 500) return true;

  // Sin respuesta del servidor
  if (error.request && !error.response) return true;

  return false;
};

export const adminService = {
  // Obtener todos los usuarios para administración
  obtenerUsuarios: async () => {
    try {
      const response = await apiClient.get('/users/all');

      // Agregar un ID temporal único a cada usuario para manejar duplicados
      const usuariosConId = response.data.map((usuario, index) => ({
        ...usuario,
        _tempId: `${usuario.email}-${index}-${Date.now()}`
      }));

      return {
        data: {
          content: usuariosConId,
          totalElements: usuariosConId.length
        }
      };
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  // Obtener todas las marcas para administración
  obtenerMarcasAdmin: async () => {
    try {
      return await apiClient.get('/marcas/all');
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  // Cambiar rol de un usuario (admin/usuario)
  cambiarRolUsuario: async (userId, nuevoRol) => {
    try {
      let endpointToConvert = nuevoRol === 'ADMIN' ? 'convert-to-admin' : 'convert-to-user';
      return await apiClient.put(`/users/${endpointToConvert}/${userId}`);
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  // Activar/desactivar usuario
  // status: true = Activo (desbloqueado)
  // status: false = Inactivo/Desactivado (bloqueado)
  toggleUsuarioActivo: async (userEmail, nuevoStatus) => {
    try {
      if (nuevoStatus === false) {
        // Desactivar usuario (cambiar status a false)
        const response = await apiClient.get('/users/desactivate', {
          params: { email: userEmail }
        });
        return response;
      } else if (nuevoStatus === true) {
        // Activar usuario (cambiar status a true)
        const response = await apiClient.get('/users/activate', {
          params: { email: userEmail }
        });
        return response;
      }
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  // Activar/desactivar marca
  toggleMarcaActiva: async (marcaId, activa) => {
    try {
      let endpoint = !activa ? "desactivate" : "activate";
      return await apiClient.patch(`/marcas/${endpoint}/${marcaId}`);
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  }
};