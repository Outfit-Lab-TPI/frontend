import apiClient from './api.js';

const isCriticalError = (error) => {
  // Errores de servidor 5xx
  if (error.response && error.response.status >= 500) return true;

  // Sin respuesta del servidor
  if (error.request && !error.response) return true;

  return false;
};


// Datos mock para simular marcas de admin
const mockMarcasAdmin = [
  {
    id: 1,
    codigoMarca: 'nike001',
    nombre: 'Nike',
    email: 'contact@nike.com',
    verificado: true,
    activa: true,
    fechaRegistro: '2024-01-10'
  },
  {
    id: 2,
    codigoMarca: 'adidas002',
    nombre: 'Adidas',
    email: 'info@adidas.com',
    verificado: true,
    activa: true,
    fechaRegistro: '2024-01-15'
  },
  {
    id: 3,
    codigoMarca: 'zara003',
    nombre: 'Zara',
    email: 'business@zara.com',
    verificado: true,
    activa: false,
    fechaRegistro: '2024-02-01'
  }
];

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
      // TODO: Implementar endpoint cuando esté disponible
      // return await apiClient.get('/marcas');

      // Simulación temporal
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              content: mockMarcasAdmin,
              totalElements: mockMarcasAdmin.length
            }
          });
        }, 800);
      });
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  // Cambiar rol de un usuario (admin/usuario)
  cambiarRolUsuario: async (userId, nuevoRol) => {
    try {
      // TODO: Implementar endpoint cuando esté disponible
      let endpointToConvert = nuevoRol === 'ADMIN' ? 'convert-to-admin' : 'convert-to-user';
      console.log(endpointToConvert + " -- nuevo rol->" + nuevoRol)
      return await apiClient.put(`/users/${endpointToConvert}/${userId}`);

      {/*} Simulación temporal
      return new Promise((resolve) => {
        setTimeout(() => {
          const usuarioIndex = mockUsuarios.findIndex(u => u.id === userId);
          if (usuarioIndex !== -1) {
            mockUsuarios[usuarioIndex].rol = nuevoRol;
          }
          resolve({
            data: {
              message: 'Rol de usuario actualizado exitosamente',
              usuario: mockUsuarios[usuarioIndex]
            }
          });
        }, 500);
      });*/}
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
      // TODO: Implementar endpoint cuando esté disponible
      // return await apiClient.put(`/marcas/${marcaId}/estado`, { activa });

      // Simulación temporal
      return new Promise((resolve) => {
        setTimeout(() => {
          const marcaIndex = mockMarcasAdmin.findIndex(m => m.id === marcaId);
          if (marcaIndex !== -1) {
            mockMarcasAdmin[marcaIndex].activa = activa;
          }
          resolve({
            data: {
              message: `Marca ${activa ? 'activada' : 'desactivada'} exitosamente`,
              marca: mockMarcasAdmin[marcaIndex]
            }
          });
        }, 500);
      });
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  }
};