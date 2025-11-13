import React, { useState } from 'react';
import SubscriptionCard from '../components/SubscriptionCard.jsx';
 import { subscriptionAPI as mpService } from '../services/api.js';

const SubscriptionPage = () => {
    const [isLoading, setIsLoading] = useState(false);

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
            cardColor: '#926490' 
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
            cardColor: 'from-purple-500 to-indigo-600' 
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
            cardColor: '#E3C18A' 
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

            console.log(`Iniciando Preferencia con plan: ${selectedPlan.name}`);

            const initPointUrl = await mpService.createPreference(
                selectedPlan.id,
                userEmail,
                selectedPlan.price,
                selectedPlan.currency
            );

            console.log("Redirigiendo a Mercado Pago (URL REAL):", initPointUrl);
            
            window.location.href = initPointUrl;
            
        } catch (error) {
            console.error("Fallo la suscripción o la comunicación con el backend:", error);
            alert('Hubo un error al iniciar el pago. Revisa la consola y el estado de tu servidor Spring Boot.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-60px)] p-8 space-y-8" > 
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="text-xl text-white animate-pulse">
                        Procesando suscripción y comunicándose con el backend...
                    </div>
                </div>
            )}
            
            <h1 className="text-center">
                Elige tu Plan
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-10 max-w-6xl mx-auto">
                {plans.map(plan => (
                    <SubscriptionCard 
                        key={plan.id}
                        subscription={plan}
                        onSubscribe={handleSubscribe} 
                        customColor={plan.cardColor} 
                    />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;