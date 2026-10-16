'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import OtpInput from './OtpComponent'
import { AppButton } from '@/components/AppButton'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthActions } from '@/hooks/useAuthActions'
import { toast } from 'react-hot-toast'
import logger from '@/lib/logger'

// Helper function to prevent duplicate toasts
const showToast: {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => void;
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => void;
} = {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => {
    toast.dismiss();
    toast.success(message, options);
  },
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => {
    toast.dismiss();
    toast.error(message, options);
  },
};
import { sanitizeEmail, sanitizeOtp } from '@/lib/sanitize'

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, verifyTwoFactor, verifyForgotPasswordOtp, verifyResetPasswordOtp, resendOtp } = useAuthActions();

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('Signup');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paramsProcessed, setParamsProcessed] = useState(false);
  const emailRef = React.useRef<string | null>(null);
  const purposeRef = React.useRef<string | null>(null);
  const hasAutoResendedRef = React.useRef(false);
  const isAutoResendRef = React.useRef(false);

  const handleResendOtp = useCallback(async () => {
    const emailToUse = emailRef.current;
    const purposeToUse = purposeRef.current || 'Signup';
    if (!emailToUse) {
      showToast.error('Email is missing. Please go back to signup.');
      return;
    }

    logger.log('[VERIFY PAGE] handleResendOtp called');
    logger.log('[VERIFY PAGE] Email:', emailToUse);
    logger.log('[VERIFY PAGE] Purpose:', purposeToUse);

    setIsResending(true);

    // Use correct purpose and notification type based on the purpose
    let otpPurpose: string;
    let notificationType: string;

    if (purposeToUse === 'TwoFactorAuthenticationLogin') {
      otpPurpose = 'TwoFactorAuthenticationLogin';
      notificationType = 'TwoFactorAuthentication';
    } else if (purposeToUse === 'ForgotPassword') {
      otpPurpose = 'ForgotPassWord';
      notificationType = 'ForgotPassWord';
    } else if (purposeToUse === 'Signup') {
      otpPurpose = 'Signup';
      notificationType = 'EmailConfirmationOtp';
    } else if (purposeToUse === 'PasswordReset') {
      otpPurpose = 'PasswordReset';
      notificationType = 'ResetPasswordOtp';
    } else {
      otpPurpose = purposeToUse;
      notificationType = 'EmailConfirmationOtp';
    }

    logger.log('[VERIFY PAGE] OTP Purpose:', otpPurpose);
    logger.log('[VERIFY PAGE] Notification Type:', notificationType);

    const result = await resendOtp({
      email: emailToUse,
      purpose: otpPurpose,
      includeAlphabet: false,
      notificationType: notificationType,
    });
    setIsResending(false);

    logger.log('[VERIFY PAGE] Resend result:', result);

    if (result.success) {
      // Only show toast if it's a manual resend (not auto-resend on mount)
      if (!isAutoResendRef.current) {
        toast.dismiss();
        showToast.success(result.message || 'OTP resent successfully!');
      }
      // Reset auto-resend flag after first use
      isAutoResendRef.current = false;
      // Reset countdown after successful resend
      setCountdown(30);
      setCanResend(false);
    }
  }, [resendOtp]);

  useEffect(() => {
    // Only process params once
    if (paramsProcessed) {
      logger.log('[VERIFY PAGE] Params already processed, skipping');
      return;
    }

    const emailParam = searchParams.get('email');
    const purposeParam = searchParams.get('purpose');
    const resendParam = searchParams.get('resend');

    logger.log('[VERIFY PAGE] Processing params:', { emailParam, purposeParam, resendParam });

    // Redirect to login if email parameter is missing
    if (!emailParam) {
      logger.log('[VERIFY PAGE] No email param, redirecting to login');
      router.push('/login');
      return;
    }

    // Store params in state and refs
    const sanitizedEmail = sanitizeEmail(emailParam);
    emailRef.current = sanitizedEmail;
    setEmail(sanitizedEmail);

    const purposeValue = purposeParam || 'Signup';
    purposeRef.current = purposeValue;
    setPurpose(purposeValue);

    logger.log('[VERIFY PAGE] Stored params:', { email: sanitizedEmail, purpose: purposeValue });

    // Mark params as processed
    setParamsProcessed(true);

    // Auto-resend OTP if resend param is present and hasn't been done yet
    // Only auto-resend for Signup purpose, not for TwoFactorAuthenticationLogin (2FA code is already sent by login API)
    if (resendParam === 'true' && !hasAutoResendedRef.current && purposeValue !== 'TwoFactorAuthenticationLogin') {
      logger.log('[VERIFY PAGE] Auto-resending OTP');
      hasAutoResendedRef.current = true;
      isAutoResendRef.current = true;
      handleResendOtp();
    }

    // Clean URL by removing query parameters after reading them
    logger.log('[VERIFY PAGE] Cleaning URL');
    router.replace('/verify');
  }, [searchParams, router, handleResendOtp, paramsProcessed]);

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
    // Prevent multiple simultaneous calls
    if (isVerifying) {
      logger.log('[VERIFY PAGE] Already verifying, ignoring duplicate call');
      return;
    }

    const otpToVerify = otpValue || otp;
    const emailToUse = emailRef.current || email;
    const purposeToUse = purposeRef.current || purpose;

    logger.log('[VERIFY PAGE] handleVerify called');
    logger.log('[VERIFY PAGE] OTP:', otpToVerify);
    logger.log('[VERIFY PAGE] Purpose:', purposeToUse);
    logger.log('[VERIFY PAGE] Email:', emailToUse);

    if (!otpToVerify || otpToVerify.length !== 6) {
      showToast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (!emailToUse) {
      showToast.error('Email is missing. Please go back to signup.');
      return;
    }

    setIsVerifying(true);

    let result;
    if (purposeToUse === 'TwoFactorAuthenticationLogin') {
      // Use 2FA verify endpoint for super-admin and 2FA-enabled accounts
      result = await verifyTwoFactor({
        twoFactorAuthCode: otpToVerify,
        email: emailToUse,
      });
    } else if (purposeToUse === 'ForgotPassword') {
      // Use forgot password OTP verify endpoint
      logger.log('[VERIFY PAGE] Calling verifyForgotPasswordOtp');
      result = await verifyForgotPasswordOtp(otpToVerify);
      logger.log('[VERIFY PAGE] verifyForgotPasswordOtp result:', result);
      if (result.success && result.token) {
        // Pass token as URL parameter to reset password page
        toast.dismiss();
        showToast.success('OTP verified successfully!');
        router.push(`/resetpassword?email=${encodeURIComponent(emailToUse)}&token=${encodeURIComponent(result.token)}`);
        setIsVerifying(false);
        return;
      } else {
        // Handle forgot password OTP verification failure
        toast.dismiss();
        showToast.error(result.error || 'Failed to verify OTP');
        setIsVerifying(false);
        return;
      }
    } else if (purposeToUse === 'PasswordReset') {
      // Use reset password OTP verify endpoint
      logger.log('[VERIFY PAGE] Calling verifyResetPasswordOtp');
      result = await verifyResetPasswordOtp(otpToVerify);
      logger.log('[VERIFY PAGE] verifyResetPasswordOtp result:', result);
      if (result.success && result.token) {
        // Pass token as URL parameter to reset password page
        toast.dismiss();
        showToast.success('OTP verified successfully!');
        router.push(`/resetpassword?email=${encodeURIComponent(emailToUse)}&token=${encodeURIComponent(result.token)}`);
        setIsVerifying(false);
        return;
      } else {
        // Handle reset password OTP verification failure
        toast.dismiss();
        showToast.error(result.error || 'Failed to verify OTP');
        setIsVerifying(false);
        return;
      }
    } else {
      // Use normal OTP verify endpoint for signup (email confirmation)
      result = await verifyOtp({
        otpCode: otpToVerify,
      });
    }

    if (result.success) {
      showToast.success('OTP verified successfully!');
      // Redirect based on purpose
      if (purposeToUse === 'TwoFactorAuthenticationLogin') {
        // For login 2FA, the server action returns a redirect URL
        if ('redirect' in result && result.redirect) {
          router.push(result.redirect);
        } else {
          // This should not happen, but fallback to login page if no redirect
          router.push('/login');
        }
      } else {
        // For signup and other purposes, redirect to login page
        router.push('/login');
      }
    } else {
      // Handle verification failure
      showToast.error(result.error || 'Failed to verify OTP');
    }

    setIsVerifying(false);
  };

  // Mask email for display
  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';

  const isFormValid = otp.length === 6;

  return (
    <>
    <div className='flex flex-col items-center w-full min-h-screen pt-20'>
      <div className='flex flex-col items-center w-full max-w-md px-6 sm:px-4 md:mx-auto mt-20 grow'>
        <h1 className='text-xl sm:text-2xl md:text-3xl text-center font-medium sm:mt-16'>Verify email</h1>
        <p className='text-sm text-[#424242] text-left pt-3'>
          We sent an OTP code to {maskedEmail}. Please enter it below to continue
        </p>

        <OtpInput
          length={6}
          onChangeOtp={handleOtpChange}
        />
           <div className='w-full flex flex-col justify-center mt-9'>
          <AppButton
            text="Verify"
            onClick={handleVerify}
            disabled={isVerifying || !isFormValid}
            isLoading={isVerifying}
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="xl" opacity={0.8} /></div>}>
      <VerifyContent />
    </Suspense>
  );
}

export default Page;