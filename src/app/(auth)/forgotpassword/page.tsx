'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { InputComponent } from "@/components/input";
import OtpInput from '@/app/(auth)/verify/OtpComponent';
import { AppButton } from '@/components/AppButton';
import { sanitizeEmail, isValidEmail, sanitizeOtp } from '@/lib/sanitize';
import { useAuthActions } from '@/hooks/useAuthActions';
import toast from 'react-hot-toast';


const Page = () => {
    const { resetPassword, isLoading } = useAuthActions();
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        otp: "",
    })

    const [showOtpInput, setShowOtpInput] = useState(false);
    const [storedEmail, setStoredEmail] = useState("");

    const isEmailValid = form.email.trim() !== "" && isValidEmail(form.email);
    const isOtpValid = form.otp.trim() !== "" && form.otp.length === 6;

    // Set cookie with 5-minute expiry
    const setCookieWithExpiry = (name: string, value: string, minutes: number) => {
        const now = new Date();
        const expireTime = now.getTime() + minutes * 60 * 1000;
        document.cookie = `${name}=${value}; expires=${new Date(expireTime).toUTCString()}; path=/`;
    };

    // Get cookie value
    const getCookie = (name: string): string | null => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    // Clear cookie
    const clearCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    // Check for existing email in cookie on mount
    useEffect(() => {
        const emailCookie = getCookie('reset_email');
        const otpCookie = getCookie('reset_otp');
        if (emailCookie && otpCookie) {
            setStoredEmail(emailCookie);
            setForm({ email: emailCookie, otp: otpCookie });
            setShowOtpInput(true);
        }
    }, []);

    // Auto-clear cookies after 10 minutes
    useEffect(() => {
        if (showOtpInput) {
            const timeout = setTimeout(() => {
                clearCookie('reset_email');
                clearCookie('reset_otp');
                toast.error('Session expired. Please try again.');
                router.push('/forgotpassword');
            }, 10 * 60 * 1000); // 10 minutes

            return () => clearTimeout(timeout);
        }
    }, [showOtpInput, router]);

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const sanitizedEmail = sanitizeEmail(form.email);
        
        if (!sanitizedEmail) {
          toast.error('Please enter your email address');
          return;
        }
        
        if (!isValidEmail(sanitizedEmail)) {
          toast.error('Please enter a valid email address');
          return;
        }
        
        const result = await resetPassword(sanitizedEmail);
        if (result.success) {
          // Store email in cookie with 10-minute expiry
          setCookieWithExpiry('reset_email', sanitizedEmail, 10);
          setStoredEmail(sanitizedEmail);
          setShowOtpInput(true);
        }
      };

    const handleOtpChange = (otpValue: string) => {
        setForm({ ...form, otp: sanitizeOtp(otpValue) });
    };

    const handleOtpSubmit = async (otpValue?: string) => {
        const otpToSubmit = otpValue || form.otp;
        
        if (!otpToSubmit || otpToSubmit.length !== 6) {
          toast.error('Please enter a valid 6-digit OTP code');
          return;
        }
        
        // Store OTP in cookie with 10-minute expiry
        setCookieWithExpiry('reset_otp', otpToSubmit, 10);
        
        // Navigate to reset password page
        router.push('/resetpassword');
      };
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
          setForm({ ...form, email: sanitizeEmail(value) });
        }
      };

    // Mask email for display
    const maskedEmail = storedEmail ? storedEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';

  return (
    <>
    <div className='flex flex-col items-center w-full min-h-screen pt-20'>
      <div className='flex flex-col items-center w-full max-w-md px-4 md:mx-auto mt-20 flex-grow'>
      
      {!showOtpInput ? (
        <>
          <h1 className='text-center md:text-[32px] text-2xl font-[600] mt-16'>Forgot Password?</h1>
          <p className='text-center'>Don&apos;t worry, we will send you a reset code</p>
          <form onSubmit={handleEmailSubmit} className='w-full max-w-md flex flex-col gap-[24px] mt-9 md:mx-auto'>
            <InputComponent
              label="Email Address"
              placeholder="Enter email address"
              name="email"
              htmlFor="email"
              type="email"
              onChange={handleChange}
              value={form.email}
            />
            <AppButton text={isLoading ? 'Sending' : 'Send OTP'} type='submit' isLoading={isLoading} disabled={isLoading || !isEmailValid} />
          </form>
        </>
      ) : (
        <>
          <h1 className='text-center md:text-[32px] text-2xl font-[600] mt-16'>Forgot Password?</h1>
          <p className='text-sm text-[#424242] text-left pt-3'>
            Enter the 6-digit OTP code sent to {maskedEmail}
          </p>
          <OtpInput 
            length={6} 
            onChangeOtp={handleOtpChange} 
            onComplete={handleOtpSubmit}
          />
          <div className='w-full flex flex-col justify-center mt-9'>
            <AppButton 
              text={isLoading ? 'Continuing...' : 'Continue'} 
              onClick={handleOtpSubmit}
              disabled={isLoading || !isOtpValid}
            />
          </div>
        </>
      )}
      </div>
      <Image src='/passwordbg.svg' alt='pep-svg'  width={1920} height={350} className='w-full h-[25vh] object-contain pointer-events-none' />
    </div>
    </>
  )
}

export default Page