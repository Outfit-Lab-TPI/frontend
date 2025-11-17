import React, { useState, useEffect } from 'react';
import SubscriptionCard from '../components/SubscriptionCard.jsx';
import { subscriptionAPI as mpService } from '../services/api.js';
import PaymentStatusDialog from "../components/shared/PaymentStatusDialog.jsx";

const SubscriptionPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [paymentStatus, setPaymentStatus] = useState(null); 
    const [paymentData, setPaymentData] = useState(null);

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

            setPaymentData({
                collectionStatus: rawCollectionStatus,
                collectionId: params.get("collection_id"),
                paymentId: params.get("payment_id"),
                externalReference: params.get("external_reference"),
                paymentType: params.get("payment_type"),
                merchantOrderId: params.get("merchant_order_id"),
                preferenceId: params.get("preference_id"),
            });

            window.history.replaceState({}, document.title, "/subscription");
        }
    }, []);

    const plans = [
        { 
            id: 'basic-monthly', 
            name: 'BÁSICO',
            price: 5990.00,
            currency: "ARS",
            frequency: 'mes', 
            description: 'Ideal para quienes recién interactúan con su probador virtual.', 
            features: [
                '20 Combinaciones en favoritos',
                'Generación de Outfits (20/día)',
                'Descargar outfits 3D (limitado)',
            ],
            cardColor: '#926490',
            isPopular:false
        },
        { 
            id: 'standard-monthly', 
            name: 'ESTÁNDAR',
            price: 14990.00,
            currency: "ARS",
            frequency: 'mes', 
            description: 'La mejor opción para experimentar con la creación de outfits.',
            features: [
                '50 Combinaciones en favoritos',
                'Generación de Outfits (50/día)',
                'Descargar outfits 3D (limitado)',
            ],
            cardColor: 'from-purple-500 to-indigo-600',
            isPopular:true
        },
        { 
            id: 'pro-monthly', 
            name: 'PRO',
            price: 24990.00,
            currency: "ARS",
            frequency: 'mes', 
            description: 'Máxima capacidad y funciones ilimitadas para profesionales.',
            features: [
                'Combinaciones ilimitadas en favoritos',
                'Generación de Outfits Ilimitada',
                'Modelos 3D ilimitados',
                ],
            cardColor: '#E3C18A',
            isPopular:false
        },
    ];

    const handleSubscribe = async (planId) => {
        if (isLoading) return;

        const userEmail = "TESTUSER705245584@testuser.com"; 

        try {
            setIsLoading(true);
            const selectedPlan = plans.find(p => p.id === planId);
            if (!selectedPlan) {
                console.error("No se encontró el plan seleccionado.");
                setIsLoading(false);
                return;
            }

            const initPointUrl = await mpService.createPreference(
                selectedPlan.id,
                userEmail,
                selectedPlan.price,
                selectedPlan.currency
            );

            window.location.href = initPointUrl;
            
        } catch (error) {
            console.error("Fallo la suscripción:", error);
            alert('Hubo un error al iniciar el pago.');
        } finally {
            setIsLoading(false);
        }
    };

    const messageByStatus = {
        approved: "¡Gracias! Tu pago fue acreditado correctamente.",
        pending: "Tu pago está en proceso. Mercado Pago lo está revisando.",
        failure: `Hubo un problema con el pago.`
    };

    return (
        <div className="min-h-[calc(100vh-60px)] p-8 space-y-8">

            <PaymentStatusDialog
                isOpen={!!paymentStatus}
                status={paymentStatus}
                message={messageByStatus[paymentStatus]}
                onClose={() => setPaymentStatus(null)}
            />

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="text-xl text-white animate-pulse">
                        Procesando suscripción...
                    </div>
                </div>
            )}

            <h1 className="text-center">Elige tu Plan</h1>

            <div className="flex flex-col md:flex-row justify-center items-stretch mt-20  space-y-8 md:space-y-0 md:space-x-10 max-w-6xl mx-auto">
                {plans.map(plan => (
                    <SubscriptionCard 
                        key={plan.id}
                        subscription={plan}
                        onSubscribe={handleSubscribe} 
                        customColor={plan.cardColor}
                        isPopular={plan.isPopular}
                    />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;



