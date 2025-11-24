import React from 'react';

const SubscriptionCard = ({ subscription = {}, onSubscribe, customColor, isPopular = false, isCurrentPlan = false }) => {

    const handleSubscribeClick = () => {
        if (isCurrentPlan) return; // No hacer nada si ya es el plan actual
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

    const getAccentColor = () => {
        if (customColor && customColor.startsWith('#')) {
            return customColor;
        } else if (customColor) {
            return customColor.split(' ').pop();
        }
        return 'blue-400';
    };

    const accentColor = getAccentColor();

    return (
        <div className={`
            relative bg-gradient-to-br from-[#230636] to-[#1a0426] rounded-2xl p-0 flex flex-col justify-between items-center text-center 
            max-w-xs mx-auto transition-all duration-300 min-h-[500px]
            hover:shadow-2xl shadow-xl border border-[#926490]/30
            ${isPopular ? 'ring-2 ring-[#E3C18A] ring-opacity-50 shadow-2xl md:scale-105 hover:scale-110' : 'hover:scale-102'}
            ${isCurrentPlan ? 'ring-2 ring-green-500/50' : ''}
        `}>

            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-[#926490] to-[#E3C18A] opacity-70"></div>

            {isPopular && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-0 z-20 animate-[shake_0.4s_ease-in-out_infinite]">
                    <div className="px-4 py-1.5 rounded-full bg-[#E3C18A] text-[#230636] text-xs font-bold tracking-wide">
                        EL MÁS POPULAR
                    </div>
                </div>
            )}

            {isCurrentPlan && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="px-4 py-1.5 rounded-full bg-green-500 text-white text-xs font-bold tracking-wide">
                        TU PLAN ACTUAL
                    </div>
                </div>
            )}

            <div className="relative w-full pt-12 pb-8 px-6 rounded-t-2xl">

                <h2 className="text-2xl font-bold mb-4 text-[#FFFCF5]">{subscription.name || 'PLAN'}</h2>

                <p className="text-6xl font-extrabold flex items-baseline justify-center mb-4 text-[#E3C18A]">
                    <span className="text-2xl align-top mr-2 font-semibold opacity-80">
                        {getCurrencySymbol(subscription.currency)}
                    </span>
                    {formattedPrice}
                </p>

                <p className="text-sm font-medium opacity-75 text-[#FFFCF5]/70 max-w-[85%] mx-auto leading-relaxed">
                    {subscription.description}
                </p>
            </div>

            <div className="text-left w-full px-6 pb-6 space-y-3 flex-grow flex flex-col">

                {subscription.frequency && (
                    <p className="text-center text-sm text-[#FFFCF5]/60 font-medium">
                        / {subscription.frequency}
                    </p>
                )}

                <div className="text-left mb-6 w-full flex-grow">
                    {subscription.features && Array.isArray(subscription.features) ? (
                        <ul className="space-y-3 text-[#FFFCF5]/80">
                            {subscription.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-base mr-3 mt-1 inline-block h-2 w-2 rounded-full flex-shrink-0 bg-[#E3C18A]"></span>
                                    <span className="text-sm leading-relaxed">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-[#FFFCF5]/40 text-center">Sin características definidas.</p>
                    )}
                </div>

                <button
                    onClick={handleSubscribeClick}
                    disabled={isCurrentPlan}
                    className={`w-full py-3 px-4 font-bold rounded-lg 
                                transition duration-200 ease-in-out shadow-lg 
                                ${isCurrentPlan
                            ? 'bg-green-500/50 text-white cursor-not-allowed'
                            : 'bg-[#E3C18A] text-[#230636] hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E3C18A] focus:ring-offset-2 focus:ring-offset-[#230636]'
                        }
                                ${isPopular && !isCurrentPlan ? 'bg-gradient-to-r from-[#E3C18A] to-[#E3C18A] text-base' : 'text-base'}
                    `}
                >
                    {isCurrentPlan ? 'Plan Actual' : (isPopular ? 'Comenzar Ahora' : 'Suscribirse')}
                </button>

            </div>

        </div>
    );
};

export default SubscriptionCard;



/*import React from 'react';

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

export default SubscriptionCard;*/