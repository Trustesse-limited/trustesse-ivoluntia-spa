'use client'
import React from 'react'
import Image from 'next/image'
import { InputComponent } from "@/components/input";
import Button from '@/components/button'
import { useState } from 'react'
import { sanitizeEmail, isValidEmail } from '@/lib/sanitize';
import { useAuthActions } from '@/hooks/useAuthActions';
import toast from 'react-hot-toast';


const Page = () => {
    const { resetPassword, isLoading } = useAuthActions();

    const [form, setForm] = useState({
        email: "",
    })

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
<h1 className='text-center md:text-[32px] text-2xl font-[600]'>Forgot Password?</h1>
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
                
        <Button text='Send Link' type='submit' isLoading={isLoading} disabled={isLoading} />
    </form>
    <Image src='/passwordbg.svg' alt='pep-svg'  width={1000} height={177} className='fixed bottom-0 left-0 z-[-1] w-full h-auto object-contain pointer-events-none' />
    </>
  )
}

export default Page