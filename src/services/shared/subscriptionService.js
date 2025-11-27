import apiClient from '../api.js';

/**
 * Servicio para manejar todas las operaciones relacionadas con suscripciones
 */
export const subscriptionService = {
    /**
     * Obtiene todos los planes de suscripción disponibles
     * @returns {Promise<Array>} Array de planes con estructura: { id, planCode, name, price, feature1, feature2, feature3 }
     */
    getAllPlans: async (email) => {
        try {
            const response = await apiClient.get('/mp/subscriptions', {
                params: email ? { email } : undefined
            });
            const data = response.data?.data ?? response.data;
            return Array.isArray(data) ? data : [];
        } catch (error) {
            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Error al obtener los planes de suscripción'
            );
        }
    },

    /**
     * Obtiene la suscripción actual del usuario
     * @returns {Promise<Object>} Objeto con: { planCode, status, usage: { combinations, favorites, models } }
     */
    getUserSubscription: async (email) => {
        try {
            const response = await apiClient.get(`/mp/user-subscription`, {
                params: email ? { email } : undefined
            });
            return response.data;
        } catch (error) {
            // Si es 404, el usuario no tiene suscripción (caso válido)
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Error al obtener la suscripción del usuario'
            );
        }
    },

    /**
     * Crea una preferencia de pago en MercadoPago
     * @param {string} planId - Código del plan (ej: "pro-monthly")
     * @param {string} userEmail - Email del usuario
     * @param {number} price - Precio del plan
     * @param {string} currency - Moneda (ej: "ARS")
     * @returns {Promise<string>} URL de redirección (initPoint) de MercadoPago
     */
    createSubscription: async (planId, userEmail, price, currency) => {
        try {
            const payload = {
                planId,
                userEmail,
                price,
                currency
            };

            const response = await apiClient.post('/mp/crear-suscripcion', payload);
            return response.data.initPoint;
        } catch (error) {
            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Error al crear la preferencia de pago'
            );
        }
    }
};
