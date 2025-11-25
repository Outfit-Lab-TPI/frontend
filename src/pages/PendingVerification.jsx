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
    const [title, setTitle] = useState("¡Correo Enviado!");
    const [message, setMessage] = useState("Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, verifica tu casilla para confirmar el el registro exitoso. (No olvides revisar spam)");
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
            setTitle("¡Correo Enviado!");
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A050E] px-4 text-white">
    <div
        className={`rounded-xl p-12 shadow-xl max-w-lg w-full text-center bg-[#1D1325] #1D1325`}
    >
        <h2 className="text-4xl font-extrabold mb-6 tracking-wide">
            {title}
        </h2>

        <p className=" text-lg mb-10">
            {message}
        </p>

        <Link
            to="/login"
            className="w-full inline-block py-4 bg-[#8F5D8D] text-white font-semibold 
                       rounded-lg transition-all duration-200 
                       shadow-md hover:shadow-xl hover:bg-[#533754]"
        >
            Volver al inicio de sesión
        </Link>
    </div>
</div>

    );
};

export default PendingVerification;