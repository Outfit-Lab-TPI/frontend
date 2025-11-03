import { useEffect } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';

const MercadoPagoWrapper = ({ children }) => {
  
  const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY; 

  useEffect(() => {
    if (MP_PUBLIC_KEY) {
      initMercadoPago(MP_PUBLIC_KEY, { locale: 'es-AR' }); 
      console.log("Mercado Pago SDK inicializado.");
    } else {
      console.error("ERROR: La Public Key de Mercado Pago no está configurada.");
    }
  }, []);

  return <>{children}</>;
};

export default MercadoPagoWrapper;