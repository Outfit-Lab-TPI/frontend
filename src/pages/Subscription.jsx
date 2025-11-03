import React from 'react';
import SubscriptionCard from '../components/SubscriptionCard'; 
import { subscriptionAPI } from '../services/api'; 


const SubscriptionPage = () => {

    const plans = [
        { 
            id: 'premium-monthly', 
            name: 'Plan Premium Mensual',
            price: 15000.00,
            currency: "ARS",
            frequency: 'mes', 
            features: ['Aumentá tus favoritos', 'Guardar tus outfits en 3D'] 
        },
    ];

    const handleSubscribe = async (planId) => {

        const userEmail = "TESTUSER705245584@testuser.com"; 

        try {
            console.log(`Iniciando pago para el plan ID: ${planId}`);
            
            const selectedPlan = plans.find(p => p.id === planId);
            if (!selectedPlan) {
                console.error("No se encontró el plan seleccionado.");
                return;
            }

            const initPointUrl = await subscriptionAPI.createPreference(
                selectedPlan.id,
                userEmail,
                selectedPlan.price,
                selectedPlan.currency
            );

            console.log("Redirigiendo a Mercado Pago:", initPointUrl);
            window.location.href = initPointUrl;
            
        } catch (error) {
            console.error("Fallo la suscripción:", error);
            alert('Hubo un error al iniciar el pago. Revisa la consola.');
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            {plans.map(plan => (
                <SubscriptionCard 
                    key={plan.id}
                    subscription={plan}
                    onSubscribe={handleSubscribe} 
                />
            ))}
        </div>
    );
};

export default SubscriptionPage;

