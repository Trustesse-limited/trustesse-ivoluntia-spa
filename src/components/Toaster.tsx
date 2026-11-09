'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{}}
      toastOptions={{
        // Default toast options
        duration: 4000,
        style: {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#1a1a1a',
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '13px',
          borderRadius: '12px',
          padding: '10px 16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
          style: {
            background: 'rgba(16, 185, 129, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#065F46',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
          style: {
            background: 'rgba(239, 68, 68, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#991B1B',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.15)',
          },
        },
        loading: {
          style: {
            background: 'rgba(59, 130, 246, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#1E40AF',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.15)',
          },
        },
      }}
    />
  );
}
