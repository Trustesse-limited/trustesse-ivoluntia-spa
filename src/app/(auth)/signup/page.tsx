'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import SignupForm from '@/components/SignupForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';

function SignupPageContent() {
  const searchParams = useSearchParams();
  const accountTypeRef = useRef<'volunteer' | 'organization' | null>(null);
  
  const accountType = searchParams.get('account') as 'volunteer' | 'organization' | null;

  // Store account type in ref on first render
  if (accountType && !accountTypeRef.current) {
    accountTypeRef.current = accountType;
  }

  // Default to volunteer if no account type parameter
  useEffect(() => {
    if (!accountTypeRef.current) {
      accountTypeRef.current = 'volunteer';
    }
  }, []);

  const type = accountTypeRef.current === 'volunteer' || accountTypeRef.current === 'organization' 
    ? accountTypeRef.current 
    : 'volunteer'; // default to volunteer if invalid type

  return <SignupForm type={type} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="xl" opacity={0.8} /></div>}>
      <SignupPageContent />
    </Suspense>
  );
}
