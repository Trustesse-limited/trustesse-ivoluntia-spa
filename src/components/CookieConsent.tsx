'use client';

import { useState, useEffect } from 'react';
import { FiInfo, FiCheck } from 'react-icons/fi';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Helper functions for cookie management
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const setCookie = (name: string, value: string, days: number = 365) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  };

  useEffect(() => {
    const consent = getCookie('cookieConsent');
    if (!consent) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 100);
    }
  }, []);

  const handleAcceptEssential = () => {
    setCookie('cookieConsent', 'essential');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleAcceptAll = () => {
    setCookie('cookieConsent', 'all');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/60 transition-all duration-300 ease-in-out ${
        isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 p-4 sm:p-6 transition-all duration-300 ease-in-out ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl mx-auto p-6 sm:p-8">
          {/* Icon and Content */}
          <div className="flex items-start gap-3 mb-6">
            <div className="shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                <FiInfo className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Cookie Preferences
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We use cookies to keep you logged in and improve your experience. Please choose your preference to continue.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-2 sm:gap-3">
            <button
              onClick={handleAcceptEssential}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-medium text-white bg-[#0E68DC] hover:bg-[#0b5cc4] rounded-2xl transition-colors duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md cursor-pointer whitespace-nowrap"
            >
              Accept All
              <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
