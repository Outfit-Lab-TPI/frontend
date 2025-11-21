import React from 'react';
import { Link } from 'react-router-dom';

const PendingVerification = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark">
      <div className="bg-gray/10 rounded-lg p-10 shadow-2xl max-w-md text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Correo Enviado 📧</h2>
        <p className="text-gray-300 mb-6">
          Te hemos enviado un enlace de verificación a tu correo electrónico. 
          Por favor, haz clic en el enlace para activar tu cuenta de Outfit Lab.
        </p>
        <p className="text-gray-400 text-sm italic">
          (Revisa tu carpeta de spam si no lo encuentras).
        </p>
        <Link to="/login" className="mt-8 inline-block px-6 py-3 bg-secondary text-white font-semibold rounded-md hover:bg-tertiary transition duration-200">
          Volver al Login
        </Link>
      </div>
    </div>
  );
};

export default PendingVerification;