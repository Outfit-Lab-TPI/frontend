import React from 'react';

const SubscriptionCard = ({ subscription = {}, onSubscribe, customColor }) => {

    const handleSubscribeClick = () => {
        if (onSubscribe && subscription?.id) {
            onSubscribe(subscription.id);
        }
    };

    const getCurrencySymbol = (currencyCode) => {
        switch (currencyCode) {
            case 'ARS': return 'AR$';
            default: return 'AR$';
        }
    };
    
    const formattedPrice = (subscription.price || 0).toLocaleString('es-AR', {
        minimumFractionDigits: (subscription.price % 1 === 0) ? 0 : 2, 
        maximumFractionDigits: 2
    });
    
    const getHeaderStyles = () => {
        if (customColor && customColor.startsWith('#')) {
            return {
                style: { backgroundColor: customColor },
                className: ''
            };
        } 
        else if (customColor) {
            return {
                style: {},
                className: `bg-gradient-to-br ${customColor}`
            };
        }
        return { style: {}, className: 'bg-gradient-to-br from-gray-400 to-gray-600' };
    };

    const headerStyles = getHeaderStyles();
    
    const accentColor = (customColor && customColor.startsWith('#')) 
        ? customColor 
        : (customColor ? customColor.split(' ').pop() : 'gray-600'); 
    
    const accentClassName = accentColor.startsWith('#') ? '' : `bg-gradient-to-r ${customColor}`;


    return (
        <div className="bg-white rounded-lg shadow-xl p-0 flex flex-col justify-between items-center text-center 
                        max-w-xs mx-auto transition-transform hover:scale-[1.03] duration-300 relative min-h-[400px]">
            
            <div className={`relative w-full text-white pt-6 pb-12 rounded-t-lg ${headerStyles.className}`} style={headerStyles.style}>
                
                <h2> {subscription.name || 'PLAN'} </h2>
                
                <p className="text-4xl font-extrabold flex items-baseline justify-center mb-1">
                    <span className="text-xl align-top mr-1 font-semibold opacity-90">
                        {getCurrencySymbol(subscription.currency)}
                    </span>
                    {formattedPrice}
                </p>
                
                <p className="text-sm font-medium opacity-80 max-w-[80%] mx-auto">
                    {subscription.description}
                </p>

                <div 
                    className={`absolute -bottom-0.5 left-0 w-full h-8 bg-white z-10`} 
                    style={{ 
                        clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)', 
                    }}
                ></div>
            </div>

            <div className="text-left w-full p-8 pt-0 space-y-2">
                
                {subscription.frequency && (
                    <p className="text-center text-gray">
                        / {subscription.frequency}
                    </p>
                )}

                <div className="text-left mb-8 w-full">
                    {subscription.features && Array.isArray(subscription.features) ? (
                        <ul className="space-y-3 text-gray-700">
                            {subscription.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <span className={`text-sm mr-2 mt-1 inline-block h-2 w-2 rounded-full flex-shrink-0 ${accentClassName}`} 
                                          style={accentColor.startsWith('#') ? { backgroundColor: accentColor } : {}}></span> 
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 text-center">Sin características definidas.</p>
                    )}
                </div>

                <button
                    onClick={handleSubscribeClick}
                    className={`mt-auto w-full py-2 px-4 text-white font-bold rounded-full 
                                transition duration-150 ease-in-out shadow-lg 
                                hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white`}
                    style={headerStyles.style} 
                    {...(!accentColor.startsWith('#') && {className: `mt-auto w-full py-2 px-4 text-white font-bold rounded-full bg-gradient-to-r ${customColor} transition duration-150 ease-in-out shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white`})}
                >
                    Suscribirse
                </button>

            </div>

        </div>
    );
};

export default SubscriptionCard;