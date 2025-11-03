import React from 'react';

const SubscriptionCard = ({ subscription, onSubscribe }) => {

  const handleSubscribeClick = () => {
    if (onSubscribe && subscription?.id) {
      onSubscribe(subscription.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col items-center text-center max-w-sm mx-auto transition-shadow hover:shadow-xl">
      
      <h2 className="text-3xl font-bold text-indigo-700 mb-2">
        {subscription.name || 'Plan Básico'}
      </h2>
      
      <p className="text-5xl font-extrabold text-gray-900 mb-4">
        ${subscription.price || '9.99'}
        <span className="text-lg font-medium text-gray-500"> / {subscription.frequency || 'mes'}</span>
      </p>
      
      <hr className="w-full border-t border-gray-200 mb-6" />

      <div className="text-left mb-8 w-full">
        {subscription.features && Array.isArray(subscription.features) ? (
          <ul className="space-y-3 text-gray-600">
            {subscription.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2 text-lg">✔</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Acceso a funciones estándar del probador virtual y combinaciones.</p>
        )}
      </div>

      <button
        onClick={handleSubscribeClick}
        className="mt-auto w-full py-3 px-6 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Suscribirse con Mercado Pago
      </button>

    </div>
  );
};

export default SubscriptionCard;