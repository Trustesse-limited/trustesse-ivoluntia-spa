'use client';

import React from 'react';
import { AppButton } from './AppButton';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
}

export function ErrorState({ 
  message = 'Oops, something went wrong',
  onRetry,
  icon
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-600 mb-6">
        Please try again
      </p>
      {onRetry && (
        <AppButton
          onClick={onRetry}
          isLoading={false}
          className="bg-[#21537B] text-white rounded-full px-6 py-2 text-sm!"
        >
          Try Again
        </AppButton>
      )}
    </div>
  );
}
