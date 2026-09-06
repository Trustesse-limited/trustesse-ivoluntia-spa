'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SignupForm from '@/components/SignupForm';

function SignupPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountTypeRef = useRef<'volunteer' | 'organization' | null>(null);
  
  const accountType = searchParams.get('account') as 'volunteer' | 'organization' | null;

  // Store account type in ref on first render
  if (accountType && !accountTypeRef.current) {
    accountTypeRef.current = accountType;
  }

  // Redirect to index if no account type parameter
  useEffect(() => {
    if (!accountTypeRef.current) {
      router.replace('/');
      return;
    }
    
    // Clean URL by removing query parameter after reading it
    if (searchParams.has('account')) {
      router.replace('/signup');
    }
  }, [searchParams, router]);

  // Don't render anything while redirecting
  if (!accountTypeRef.current) {
    return null;
  }

  const type = accountTypeRef.current === 'volunteer' || accountTypeRef.current === 'organization' 
    ? accountTypeRef.current 
    : 'volunteer'; // default to volunteer if invalid type

  return <SignupForm type={type} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageContent />
    </Suspense>
  );
}
