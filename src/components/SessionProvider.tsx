'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { registerSessionExpiredHandler } from '@/lib/axios';
import SessionExpiredModal from './SessionExpiredModal';

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionExpired, setSessionExpired } = useAuthStore();

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      setSessionExpired(true);
    });
  }, [setSessionExpired]);

  // onClose is a no-op: the modal is non-dismissable. It can only be
  // closed by logging out or refreshing the session from within the modal.
  return (
    <>
      {children}
      <SessionExpiredModal
        isOpen={sessionExpired}
        onClose={() => {}}
        canRefresh={true}
      />
    </>
  );
}