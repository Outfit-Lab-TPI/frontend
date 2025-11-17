import apiClient from './api.js';

const isCriticalError = (error) => {
  // Errores de servidor 5xx
  if (error.response && error.response.status >= 500) return true;

  // Sin respuesta del servidor
  if (error.request && !error.response) return true;

  return false;
};

// Datos mock para simular usuarios
const mockUsuarios = [
  {
    id: 1,
    nombre: 'Carlos',
    apellido: 'Ramirez',
    email: 'usuario1@predictor.com',
    verificado: true,
    rol: 'administrador',
    activo: true,
    fechaCreacion: '2024-01-15'
  },
  {
    id: 2,
    nombre: 'Lucia',
    apellido: 'Fernandez',
    email: 'usuario2@predictor.com',
    verificado: true,
    rol: 'administrador',
    activo: true,
    fechaCreacion: '2024-02-20'
  },
  {
    id: 3,
    nombre: 'Miguel',
    apellido: 'Sanchez',
    email: 'usuario3@predictor.com',
    verificado: false,
    rol: 'administrador',
    activo: false,
    fechaCreacion: '2024-03-10'
  }
];

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
      // TODO: Implementar endpoint cuando esté disponible
      // return await apiClient.get('/usuarios');

      // Simulación temporal
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              content: mockUsuarios,
              totalElements: mockUsuarios.length
            }
          });
        }, 800);
      });
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
      // return await apiClient.put(`/usuarios/${userId}/rol`, { rol: nuevoRol });

      // Simulación temporal
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
      });
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  // Activar/desactivar usuario
  toggleUsuarioActivo: async (userId, activo) => {
    try {
      // TODO: Implementar endpoint cuando esté disponible
      // return await apiClient.put(`/usuarios/${userId}/estado`, { activo });

      // Simulación temporal
      return new Promise((resolve) => {
        setTimeout(() => {
          const usuarioIndex = mockUsuarios.findIndex(u => u.id === userId);
          if (usuarioIndex !== -1) {
            mockUsuarios[usuarioIndex].activo = activo;
          }
          resolve({
            data: {
              message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`,
              usuario: mockUsuarios[usuarioIndex]
            }
          });
        }, 500);
      });
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