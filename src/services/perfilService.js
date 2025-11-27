import apiClient from './api.js';

const isCriticalError = (error) => {
  if (error.response && error.response.status >= 500) return true;
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
  // Actualizar perfil del usuario
  actualizarPerfil: async (userId, formData) => {
    try {
      validarFormDataPerfil(formData);
      const response = await apiClient.put(`/users/update/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;

    } catch (error) {
      error.isCritical = isCriticalError(error);
      console.error('Error en perfilService.actualizarPerfil:', error);

      if (error.response?.status === 409) {
        throw new Error('Este email ya está en uso por otra cuenta');
      } else if (error.response?.status === 400) {
        throw new Error('Datos inválidos. Revisa los campos y vuelve a intentar.');
      }

      // Para otros errores, usar mensaje del servidor o genérico
      throw new Error(
        error.response?.data?.message || 'Error al actualizar el perfil'
      );
    }
  },

};