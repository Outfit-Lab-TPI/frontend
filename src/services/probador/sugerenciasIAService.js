import apiClient from '../api.js';

const BASE_OUTFIT_URL = '/outfits';
const BASE_CATEGORY_URL = '/categories';

const mapApiError = (error, defaultMessage) => {
    
    return new Error(
        error.response?.data?.message || defaultMessage
    );
};

export const sugerenciasIAService = {

 /**
 * @returns {Promise<RecommendationCategoriesDTO>}
 */

    obtenerCategoriasRecomendacion: async () => {
        try {
            const response = await apiClient.get(`${BASE_CATEGORY_URL}/recommendation`);
            
            return response.data; 
        } catch (error) {
            console.error('Error en sugerenciasIAService.obtenerCategoriasRecomendacion:', error);
            throw mapApiError(error, 'Error al obtener las categorías de recomendación.');
        }
    },

    obtenerRecomendacionesPorTexto: async (userId, peticionUsuario) => {
        try {
            const response = await apiClient.post(`${BASE_OUTFIT_URL}/recommend`, {
                idUsuario: userId,
                peticionUsuario: peticionUsuario
            });

            if (response.status === 204 || !response.data) {
                return [];
            }

            return response.data; 
        } catch (error) {
            console.error('Error en outfitlabService.obtenerRecomendacionesPorTexto:', error);

            if (error.response?.status === 404) {
                throw mapApiError(error, 'No se encontraron prendas para esa combinación de clima/ocasión.');
            }

            throw mapApiError(error, 'Error al procesar la petición de recomendación.');
        }
    }
    
};