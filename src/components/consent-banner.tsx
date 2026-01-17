import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { CONSENT_BANNER } from '@/constants/consent';

export const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consentAccepted = localStorage.getItem(CONSENT_BANNER.STORAGE_KEY);
      if (!consentAccepted) {
        setIsVisible(true);
      }
    } catch (error) {
      // If localStorage is not available (e.g., private browsing), show banner
      console.warn('localStorage not available:', error);
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_BANNER.STORAGE_KEY, 'true');
      setIsVisible(false);
    } catch (error) {
      // If localStorage is not available, just hide the banner for this session
      console.warn('Could not save consent to localStorage:', error);
      setIsVisible(false);
    }
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
              {CONSENT_BANNER.TITLE}
            </h3>
            <p className="text-sm text-gray-600">
              {CONSENT_BANNER.MESSAGE}{' '}
              <Link 
                to={CONSENT_BANNER.TERMS_PATH}
                className="text-mint-600 hover:text-mint-800 underline font-medium"
              >
                {CONSENT_BANNER.TERMS_LINK_TEXT}
              </Link>
              {' '}y nuestra{' '}
              <Link 
                to={CONSENT_BANNER.PRIVACY_PATH}
                className="text-mint-600 hover:text-mint-800 underline font-medium"
              >
                {CONSENT_BANNER.PRIVACY_LINK_TEXT}
              </Link>
              {CONSENT_BANNER.ADDITIONAL_MESSAGE}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleAccept}
              className="bg-mint-600 text-mint-950 px-6 py-3 rounded-lg font-semibold hover:bg-mint-700 transition-colors whitespace-nowrap"
            >
              {CONSENT_BANNER.ACCEPT_BUTTON_TEXT}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
