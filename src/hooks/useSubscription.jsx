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
            const backendPlans = await subscriptionService.getAllPlans(user?.email);

            // Normalizar planes para el frontend (sin filtros locales; backend debería filtrar, pero igual clasificamos)
            const normalizedPlans = backendPlans.map(plan => {
                const planCode = plan.plan_code || plan.planCode || plan.plancode;
                const planType = (plan.planType || plan.plan_type || '').toUpperCase();
                const features = [
                    plan.feature1,
                    plan.feature2,
                    plan.feature3,
                    plan.feature4
                ].filter(Boolean);

                const maxGarments = plan.max_garments ?? plan.maxGarments;
                if (maxGarments) features.push(`Hasta ${maxGarments} prendas`);

                if (plan.has_analytics || plan.hasAnalytics) {
                    features.push('✅ Analytics incluidas');
                }
                    if (plan.has_advanced_reports || plan.hasAdvancedReports) {
                        features.push('✅ Reportes avanzados');
                    }

                    return {
                        id: planCode,
                        planCode,
                        name: plan.name,
                        price: plan.price ?? 0,
                        currency: plan.currency || 'ARS',
                        frequency: plan.frequency || 'mes',
                        description: plan.description || plan.planType || '',
                        features,
                        cardColor: plan.cardColor || plan.card_color,
                        isPopular: !!plan.isPopular,
                        planType,
                    };
            });

            // Filtrar según rol (USER vs BRAND) usando planType; fallback: planCode contiene "brand".
            const targetType = user?.role === 'BRAND' ? 'BRAND' : 'USER';
            const currentSegment = (userSubscription?.planCode || '').includes('brand')
              ? 'brand'
              : (userSubscription?.planCode || '').includes('user')
              ? 'user'
              : null;

            let filtered = normalizedPlans.filter(p => {
                const code = (p.planCode || p.plan_code || '').toLowerCase();
                const typeMatch = p.planType ? p.planType === targetType : false;
                const segmentMatch = currentSegment ? code.includes(currentSegment) : false;

                if (segmentMatch) return true;       // Prioridad: mismo segmento que la suscripción actual
                if (typeMatch) return true;          // Luego, planType si viene informado

                if (code) {
                    return targetType === 'BRAND'
                        ? code.includes('brand')
                        : !code.includes('brand');
                }
                return false; // sin pistas, no incluir para evitar mezclar planes
            });

            setPlans(filtered);
        } catch (err) {
            setError(err.message);
            console.error('Error al cargar planes:', err);
            setPlans([]); // evitar mostrar planes antiguos si falla
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
            const subscription = await subscriptionService.getUserSubscription(user?.email);
            setUserSubscription(subscription);
        } catch (err) {
            setError(err.message);
            setUserSubscription(null);
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
    }, [fetchPlans, user?.role, user?.email]);

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
