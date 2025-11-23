import { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '../services/subscriptionService.js';
import { useAuth } from './auth/useAuth.jsx';

/**
 * Hook personalizado para gestionar el estado de suscripciones
 * @returns {Object} Estado y funciones para manejar suscripciones
 */
export const useSubscription = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [userSubscription, setUserSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Carga todos los planes disponibles desde el backend
     */
    const fetchPlans = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const backendPlans = await subscriptionService.getAllPlans();

            // Transformar planes del backend al formato del frontend
            const transformedPlans = backendPlans.map(plan =>
                subscriptionService.transformPlanToFrontend(plan)
            );

            setPlans(transformedPlans);
        } catch (err) {
            setError(err.message);
            console.error('Error al cargar planes:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Carga la suscripción actual del usuario
     */
    const fetchUserSubscription = useCallback(async () => {
        if (!user?.email) {
            setUserSubscription(null);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const subscription = await subscriptionService.getUserSubscription(user.email);
            setUserSubscription(subscription);
        } catch (err) {
            setError(err.message);
            console.error('Error al cargar suscripción del usuario:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user?.email]);

    /**
     * Inicia el proceso de suscripción a un plan
     * @param {string} planId - ID del plan (planCode)
     */
    const subscribe = useCallback(async (planId) => {
        if (!user?.email) {
            setError('Debes iniciar sesión para suscribirte');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Buscar el plan seleccionado
            const selectedPlan = plans.find(p => p.id === planId);
            if (!selectedPlan) {
                throw new Error('Plan no encontrado');
            }

            // Crear preferencia de pago
            const initPointUrl = await subscriptionService.createSubscription(
                selectedPlan.planCode,
                user.email,
                selectedPlan.price,
                selectedPlan.currency
            );

            // Redirigir a MercadoPago
            window.location.href = initPointUrl;
        } catch (err) {
            setError(err.message);
            console.error('Error al iniciar suscripción:', err);
            setIsLoading(false);
        }
    }, [user?.email, plans]);

    /**
     * Verifica si el usuario tiene un plan específico activo
     * @param {string} planCode - Código del plan a verificar
     * @returns {boolean} True si el usuario tiene ese plan activo
     */
    const hasActivePlan = useCallback((planCode) => {
        return userSubscription?.planCode === planCode &&
            userSubscription?.status === 'ACTIVE';
    }, [userSubscription]);

    /**
     * Refresca tanto los planes como la suscripción del usuario
     */
    const refresh = useCallback(async () => {
        await Promise.all([fetchPlans(), fetchUserSubscription()]);
    }, [fetchPlans, fetchUserSubscription]);

    // Cargar planes al montar el componente
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Cargar suscripción del usuario cuando cambia el usuario
    useEffect(() => {
        fetchUserSubscription();
    }, [fetchUserSubscription]);

    return {
        plans,
        userSubscription,
        isLoading,
        error,
        fetchPlans,
        fetchUserSubscription,
        subscribe,
        hasActivePlan,
        refresh
    };
};
