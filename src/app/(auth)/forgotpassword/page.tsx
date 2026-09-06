'use client'
import React from 'react'
import Image from 'next/image'
import { InputComponent } from "@/components/input";
import { AppButton } from '@/components/AppButton';
import { useState } from 'react'
import { sanitizeEmail, isValidEmail } from '@/lib/sanitize';
import { useAuthActions } from '@/hooks/useAuthActions';
import toast from 'react-hot-toast';


const Page = () => {
    const { resetPassword, isLoading } = useAuthActions();

    const [form, setForm] = useState({
        email: "",
    })

    const isFormValid = form.email.trim() !== "" && isValidEmail(form.email);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // SECURITY: Sanitize email before validation
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
          setForm({ email: "" });
        }
      };
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // SECURITY: Sanitize as the user types
        setForm({ ...form, email: sanitizeEmail(e.target.value) });
      };
  return (
    <>
    <div className='flex flex-col items-center w-full min-h-screen'>
      <div className='flex flex-col items-center w-full max-w-md mx-auto flex-grow'>
      <h1 className='text-center md:text-[32px] text-2xl font-[600] mt-16'>Forgot Password?</h1>
      <p className='text-center'>Dont worry, we will send you a reset link</p>
      <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-[24px] mt-9 mx-auto'>
         <InputComponent
                  label="Email Address"
                  placeholder="Enter email address"
                  name="email"
                  htmlFor="email"
                  type="email"
                  onChange={handleChange}
                   value={form.email}
                />
                
        <AppButton text='Send Link' type='submit' isLoading={isLoading} disabled={isLoading || !isFormValid} />
      </form>
      </div>
      <Image src='/passwordbg.svg' alt='pep-svg'  width={1920} height={350} className='w-full h-[25vh] object-contain pointer-events-none' />
    </div>
    </>
  )
}

export default Page