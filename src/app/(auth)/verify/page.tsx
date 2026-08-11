'use client'

import React, { useState, useEffect, Suspense } from 'react'
import OtpInput from './OtpComponent'
import Button from '@/components/button'
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

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const typeParam = searchParams.get('type');
    
    if (emailParam) {
      // SECURITY: Sanitize email from URL params
      setEmail(sanitizeEmail(emailParam));
    }
    if (typeParam) {
      setAccountType(typeParam);
    }
  }, [searchParams]);

  const handleOtpChange = (otpValue: string) => {
    // SECURITY: Sanitize OTP (digits only)
    setOtp(sanitizeOtp(otpValue));
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (!email) {
      toast.error('Email is missing. Please go back to signup.');
      return;
    }

    const result = await verifyOtp({
      email: email,
      otpCode: otp,
    });

    if (result.success) {
      toast.success('Email verified successfully!');
      // Redirect to login page after successful OTP verification
      router.push('/login');
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email is missing. Please go back to signup.');
      return;
    }

    const result = await resendOtp({
      email: email,
      purpose: 1, // Purpose 1 for email verification
    });

    if (result.success) {
      toast.success('OTP resent successfully!');
    }
  };

  // Mask email for display
  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';

  return (
    <>
    <div className='flex flex-col items-center w-full max-w-md mx-auto'>
        <h1 className='text-3xl text-center font-medium'>Verify email</h1>
        <p className='text-sm text-[#424242] text-center pt-3'>
          We sent an OTP code to {maskedEmail}. Please enter it below to continue
        </p>
     
        <OtpInput length={6} onChangeOtp={handleOtpChange} />
           <div className='w-full flex flex-col justify-center mt-9'>
          <Button 
            text={isLoading ? 'Verifying...' : 'Verify'} 
            onClick={handleVerify}
            disabled={isLoading}
          />
          </div>
        <p className='text-sm font-light text-center pt-4 '>
          Yet to receive? <span 
            className='font-medium text-[#319F43] cursor-pointer'
            onClick={handleResendOtp}
          >Resend OTP</span>
        </p>
      
    </div>
      <Image src='/bgframe.svg' alt='bgframe' width={1000} height={219}  className='fixed bottom-0 left-0 z-[-1] w-full h-auto object-contain pointer-events-none'/>
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