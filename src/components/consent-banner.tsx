import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const CONSENT_KEY = 'casa-alba-consent-accepted';

export const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentAccepted = localStorage.getItem(CONSENT_KEY);
    if (!consentAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-mint-600 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bienvenido a Productos Casa Alba
            </h3>
            <p className="text-sm text-gray-600">
              Al acceder y utilizar este sitio web, usted acepta automáticamente nuestros{' '}
              <Link 
                to="/terminos-y-condiciones" 
                className="text-mint-600 hover:text-mint-800 underline font-medium"
              >
                Términos y Condiciones
              </Link>
              {' '}y nuestra{' '}
              <Link 
                to="/politica-de-privacidad" 
                className="text-mint-600 hover:text-mint-800 underline font-medium"
              >
                Política de Privacidad
              </Link>
              . Utilizamos cookies y tecnologías de seguimiento para mejorar su experiencia de compra y personalizar nuestros servicios.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleAccept}
              className="bg-mint-600 text-mint-950 px-6 py-3 rounded-lg font-semibold hover:bg-mint-700 transition-colors whitespace-nowrap"
            >
              Aceptar y Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
