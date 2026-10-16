'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { InputComponent } from "@/components/input";
import { AppButton } from '@/components/AppButton';
import { sanitizeEmail, isValidEmail } from '@/lib/sanitize';
import { useAuthActions } from '@/hooks/useAuthActions';
import toast from 'react-hot-toast';

const ForgotPasswordPageClient = () => {
    const { resetPassword, isLoading } = useAuthActions();
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
    })

    const isEmailValid = form.email.trim() !== "" && isValidEmail(form.email);

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
          // Redirect to verify page for OTP verification
          // Email is passed as URL parameter, no need to store in cookie
          router.push(`/verify?email=${encodeURIComponent(sanitizedEmail)}&purpose=ForgotPassword`);
        }
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
          setForm({ ...form, email: sanitizeEmail(value) });
        }
      };

  return (
    <>
    <div className='flex flex-col items-center w-full min-h-screen pt-20'>
      <div className='flex flex-col items-center w-full max-w-md px-6 sm:px-4 md:mx-auto mt-20 grow'>
        <h1 className='text-center md:text-[32px] text-xl sm:text-2xl font-semibold sm:mt-16'>Forgot Password?</h1>
        <p className='text-center text-sm sm:text-base'>Don&apos;t worry, we will send you a reset code</p>
        <form onSubmit={handleEmailSubmit} className='w-full max-w-md flex flex-col gap-6 mt-9 md:mx-auto'>
          <InputComponent
            label="Email Address"
            placeholder="Enter email address"
            name="email"
            htmlFor="email"
            type="email"
            onChange={handleChange}
            value={form.email}
          />
          <AppButton text="Send OTP" type='submit' isLoading={isLoading} disabled={isLoading || !isEmailValid} />
        </form>
      </div>
      <Image src='/passwordbg.svg' alt='pep-svg'  width={1920} height={350} className='w-full h-[25vh] object-contain pointer-events-none' />
    </div>
    </>
  )
}

export default ForgotPasswordPageClient;
