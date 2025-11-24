import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const getMailProviderUrl = (email) => {
    if (!email) return 'https://mail.google.com/';

    const domain = email.substring(email.lastIndexOf("@") + 1).toLowerCase();

    switch (domain) {
        case 'gmail.com':
        case 'googlemail.com':
            return 'https://mail.google.com/';
        case 'hotmail.com':
        case 'outlook.com':
        case 'live.com':
            return 'https://outlook.live.com/';
        case 'yahoo.com':
            return 'https://mail.yahoo.com/';
        case 'aol.com':
            return 'https://mail.aol.com/';
        default:
            return 'https://www.google.com/search?q=iniciar+sesión+' + domain;
    }
};

const PendingVerification = () => {
    const location = useLocation();
    const [userEmail, setUserEmail] = useState('');
    const [title, setTitle] = useState("Correo Enviado 📧");
    const [message, setMessage] = useState("Te hemos enviado un enlace de verificación a tu correo electrónico.");
    const [status, setStatus] = useState('pending');
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        let email = params.get('email');
        const verificationStatus = params.get('verification');
        const errorMessage = params.get('message');

        if (!email) {
            email = localStorage.getItem('pendingVerificationEmail');
        }
        if (email) {
            setUserEmail(email);
        }

        if (verificationStatus === 'success') {
            setStatus('success');
            setTitle("¡Verificación Exitosa! 🎉");
            setMessage("Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión.");
        } else if (verificationStatus === 'error') {
            setStatus('error');
            setTitle("Error de Verificación ❌");
            setMessage(errorMessage || "El enlace de verificación es inválido o ha expirado.");
        } else {
            setStatus('pending');
            setTitle("Correo Enviado 📧");
            setMessage(`Te hemos enviado un enlace de verificación a tu correo electrónico: ${email || 'la dirección registrada'}.`);
        }

    }, [location.search]);

    const mailUrl = getMailProviderUrl(userEmail);
    
    const getCardStyle = () => {
        if (status === 'success') return 'bg-green-600/10 border-green-400';
        if (status === 'error') return 'bg-red-600/10 border-red-400';
        return 'bg-gray-700/50 border-gray-600';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <div className={`rounded-lg p-10 shadow-2xl max-w-md text-center border ${getCardStyle()}`}>
                <h2 className={`text-3xl font-bold mb-4 ${status === 'success' ? 'text-green-400' : 'text-white'}`}>
                    {title}
                </h2>
                <p className="text-gray-300 mb-6">
                    {message}
                </p>

                {status === 'pending' && (
                    <>
                        <a href={mailUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block px-6 py-3 bg-secondary text-white font-semibold rounded-md hover:bg-tertiary transition duration-200">
                            Ir a mi correo
                        </a>
                        <p className="text-gray-400 text-sm italic mt-4">
                            (Revisa tu carpeta de spam si no lo encuentras).
                        </p>
                    </>
                )}
                
                <p className={`mt-6 text-gray-400 ${status === 'pending' ? 'mt-4' : 'mt-0'}`}>
                    {status === 'pending' ? '¿Ya verificaste tu correo?' : ' '}
                </p>
                
                <Link to="/login" className="inline-block px-6 py-3 bg-tertiary text-white font-semibold rounded-md hover:bg-secondary transition duration-200">
                    Ir al Login
                </Link>
            </div>
        </div>
    );
};

export default PendingVerification;