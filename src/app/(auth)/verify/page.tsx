'use client'

import React, { useState, useEffect, Suspense } from 'react'
import OtpInput from './OtpComponent'
import { AppButton } from '@/components/AppButton'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthActions } from '@/hooks/useAuthActions'
import toast from 'react-hot-toast'
import { sanitizeEmail, sanitizeOtp } from '@/lib/sanitize'

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp, isLoading } = useAuthActions();
  
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const emailRef = React.useRef<string | null>(null);
  const accountTypeRef = React.useRef<string | null>(null);
  const hasAutoResendedRef = React.useRef(false);
  const isAutoResendRef = React.useRef(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const typeParam = searchParams.get('type');
    const resendParam = searchParams.get('resend');
    
    // Redirect to login if email parameter is missing AND not already stored in ref
    if (!emailParam && !emailRef.current) {
      router.push('/login');
      return;
    }
    
    // Store params in ref on first render
    if (emailParam && !emailRef.current) {
      emailRef.current = sanitizeEmail(emailParam);
      setEmail(emailRef.current);
    }
    if (typeParam && !accountTypeRef.current) {
      accountTypeRef.current = typeParam;
      setAccountType(accountTypeRef.current);
    }
    
    // Auto-resend OTP if resend param is present and hasn't been done yet
    if (resendParam === 'true' && emailRef.current && !hasAutoResendedRef.current) {
      hasAutoResendedRef.current = true;
      isAutoResendRef.current = true;
      handleResendOtp();
    }
    
    // Clean URL by removing query parameters after reading them
    if (searchParams.has('email') || searchParams.has('type') || searchParams.has('resend')) {
      router.replace('/verify');
    }
  }, [searchParams, router]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (otpValue: string) => {
    // SECURITY: Sanitize OTP (digits only)
    setOtp(sanitizeOtp(otpValue));
  };

  const handleVerify = async (otpValue?: string) => {
    const otpToVerify = otpValue || otp;
    
    if (!otpToVerify || otpToVerify.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (!email) {
      toast.error('Email is missing. Please go back to signup.');
      return;
    }

    const result = await verifyOtp({
      otpCode: otpToVerify,
    });

    if (result.success) {
      toast.success('Email verified successfully!');
      // Redirect to login page after successful OTP verification
      router.push('/login');
    }
  };

  const handleResendOtp = async () => {
    const emailToUse = email || emailRef.current;
    if (!emailToUse) {
      toast.error('Email is missing. Please go back to signup.');
      return;
    }

    setIsResending(true);
    const result = await resendOtp({
      email: emailToUse,
      purpose: 'Signup',
      includeAlphabet: false,
      notificationType: 'email',
    });
    setIsResending(false);

    if (result.success) {
      // Only show toast if it's a manual resend (not auto-resend on mount)
      if (!isAutoResendRef.current) {
        toast.success('OTP resent successfully!');
      }
      // Reset auto-resend flag after first use
      isAutoResendRef.current = false;
      // Reset countdown after successful resend
      setCountdown(30);
      setCanResend(false);
    }
  };

  // Mask email for display
  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';

  const isFormValid = otp.length === 6;

  return (
    <>
    <div className='flex flex-col items-center w-full min-h-screen pt-20'>
      <div className='flex flex-col items-center w-full max-w-md px-4 md:mx-auto mt-20 flex-grow'>
        <h1 className='text-3xl text-center font-medium mt-16'>Verify email</h1>
        <p className='text-sm text-[#424242] text-left pt-3'>
          We sent an OTP code to {maskedEmail}. Please enter it below to continue
        </p>
     
        <OtpInput 
          length={6} 
          onChangeOtp={handleOtpChange} 
          onComplete={handleVerify}
        />
           <div className='w-full flex flex-col justify-center mt-9'>
          <AppButton 
            text={isLoading ? 'Verifying...' : 'Verify'} 
            onClick={handleVerify}
            disabled={isLoading || !isFormValid}
          />
          </div>
        <p className='text-sm font-light text-center pt-4 '>
          Yet to receive? <span 
            className={`font-medium ${canResend && !isResending ? 'text-[#319F43] cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
            onClick={canResend && !isResending ? handleResendOtp : undefined}
          >
            {isResending ? 'Resending...' : canResend ? 'Resend OTP' : `Resend OTP (${countdown}s)`}
          </span>
        </p>
      </div>
      <Image src='/bgframe.svg' alt='bgframe' width={1920} height={350}  className='w-full h-[25vh] object-contain pointer-events-none'/>
    </div>
    </>
  );
}

function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}

export default Page;