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
          background: 'white',
          color: '#0a0a0a',
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '14px',
          borderRadius: '10px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e5e5',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#42A5F5',
            secondary: '#FFFFFF',
          },
          style: {
            background: 'white',
            color: '#0a0a0a',
            borderLeft: '4px solid #42A5F5',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#FFFFFF',
          },
          style: {
            background: 'white',
            color: '#0a0a0a',
            borderLeft: '4px solid #ef4444',
          },
        },
        loading: {
          style: {
            background: 'white',
            color: '#0a0a0a',
            borderLeft: '4px solid #42A5F5',
          },
        },
      }}
    />
  );
}
