import React, { useState, useEffect } from 'react';
import SubscriptionCard from '../components/SubscriptionCard.jsx';
import PaymentStatusDialog from "../components/shared/PaymentStatusDialog.jsx";
import { useSubscription } from '../hooks/useSubscription.jsx';
import { useAuth } from '../hooks/auth/useAuth.jsx';

const SubscriptionPage = () => {
    const { user } = useAuth();
    const { plans, userSubscription, isLoading: subscriptionLoading, error, subscribe, refresh } = useSubscription();

    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const rawCollectionStatus = params.get("collection_status");

        if (rawCollectionStatus) {
            const raw = String(rawCollectionStatus).toLowerCase().trim();

            let normalized;
            if (raw === "approved") normalized = "approved";
            else if (raw === "pending" || raw === "in_process") normalized = "pending";
            else normalized = "failure";

            setPaymentStatus(normalized);

            // Limpiar URL
            window.history.replaceState({}, document.title, "/suscripcion");

            // Si el pago fue aprobado, refrescar la suscripción del usuario
            if (normalized === "approved") {
                setTimeout(() => {
                    refresh();
                }, 1000);
            }
        }
    }, [refresh]);

    const handleSubscribe = async (planId) => {
        if (!user) {
            alert('Debes iniciar sesión para suscribirte');
            return;
        }
        await subscribe(planId);
    };

    const messageByStatus = {
        approved: "¡Gracias! Tu pago fue acreditado correctamente. Tu plan ha sido actualizado.",
        pending: "Tu pago está en proceso. Mercado Pago lo está revisando.",
        failure: `Hubo un problema con el pago. Por favor, intenta nuevamente.`
    };

    return (
        <div className="min-h-[calc(100vh-60px)] p-8 space-y-8">

            <PaymentStatusDialog
                isOpen={!!paymentStatus}
                status={paymentStatus}
                message={messageByStatus[paymentStatus]}
                onClose={() => setPaymentStatus(null)}
            />

            {subscriptionLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="text-xl text-white animate-pulse">
                        Cargando planes...
                    </div>
                </div>
            )}

            {error && (
                <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                    <p className="font-semibold">Error al cargar planes</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div className="text-center space-y-4">
                <h1>Elige tu Plan</h1>

                {userSubscription && (
                    <div className="max-w-2xl mx-auto bg-[#230636]/30 border border-[#926490]/30 rounded-lg p-4">
                        <p className="text-[#E3C18A] font-semibold">
                            Plan Actual: {userSubscription.planCode === 'free-monthly' ? 'FREE' : 'PRO'}
                        </p>
                        <p className="text-[#FFFCF5]/70 text-sm mt-2">
                            Estado: {userSubscription.status === 'ACTIVE' ? 'Activo' : userSubscription.status}
                        </p>
                        {userSubscription.usage && (
                            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-[#FFFCF5]/50">Favoritos</p>
                                    <p className="text-[#E3C18A] font-semibold">
                                        {userSubscription.usage.favorites?.count || 0}
                                        {userSubscription.usage.favorites?.max ? `/${userSubscription.usage.favorites.max}` : '/∞'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[#FFFCF5]/50">Combinaciones</p>
                                    <p className="text-[#E3C18A] font-semibold">
                                        {userSubscription.usage.combinations?.used || 0}
                                        {userSubscription.usage.combinations?.max ? `/${userSubscription.usage.combinations.max}` : '/∞'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[#FFFCF5]/50">Modelos 3D</p>
                                    <p className="text-[#E3C18A] font-semibold">
                                        {userSubscription.usage.models?.generated || 0}
                                        {userSubscription.usage.models?.max ? `/${userSubscription.usage.models.max}` : '/∞'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row justify-center items-stretch mt-20 space-y-8 md:space-y-0 md:space-x-10 max-w-6xl mx-auto">
                {plans.map(plan => (
                    <SubscriptionCard
                        key={plan.id}
                        subscription={plan}
                        onSubscribe={handleSubscribe}
                        customColor={plan.cardColor}
                        isPopular={plan.isPopular}
                        isCurrentPlan={userSubscription?.planCode === plan.planCode && userSubscription?.status === 'ACTIVE'}
                    />
                ))}
            </div>

            {plans.length === 0 && !subscriptionLoading && !error && (
                <div className="text-center text-[#FFFCF5]/50 mt-20">
                    <p>No hay planes disponibles en este momento.</p>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPage;




