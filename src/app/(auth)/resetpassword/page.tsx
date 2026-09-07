'use client'
import React from 'react'
import { useState } from 'react';
import { InputComponent } from '@/components/input';
import { AppButton } from '@/components/AppButton';
import Image from 'next/image';

const Page = () => {
    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: "",
      });

    const isFormValid = form.newPassword.trim() !== "" && 
                        form.confirmPassword.trim() !== "" && 
                        form.newPassword === form.confirmPassword;
    
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

      };
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
  return (
    <>
    <div className='flex flex-col items-center w-full min-h-screen'>
      <div className='flex flex-col items-center w-full max-w-md mx-auto flex-grow'>
      <h1 className='text-center md:text-[32px] text-2xl font-[600] mt-16'>Reset Password</h1>
      <p className='text-center'>Please use a password you can remember</p>
      <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-[24px] mt-9 mx-4 md:mx-auto'>
        <InputComponent
          label=" New Password"
          placeholder="Enter new password"
          name="newPassword"
          htmlFor="newPassword"
          type="password"
          onChange={handleChange}
          value={form.newPassword}
        />
        
        <InputComponent
          label="Confirm Password"
          placeholder="Confirm new Password"
          name="confirmPassword"
          htmlFor="confirmPassword"
          type="password"
          onChange={handleChange}
          value={form.confirmPassword}
        />
        <AppButton text='Reset' disabled={!isFormValid} />
      </form>
      </div>
      <Image src='/resetbg.svg' alt='pep-svg'  width={1920} height={350} className='w-full h-[25vh] object-contain pointer-events-none' />
    </div>
    </>
  )
}

export default Page