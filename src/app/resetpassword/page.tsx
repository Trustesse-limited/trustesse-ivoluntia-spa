'use client'
import React from 'react'
import { useState } from 'react';
import { InputComponent } from '@/components/input';
import Button from '@/components/button';
import Image from 'next/image';

const page = () => {

    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: "",
      });
    
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted:", form);
      };
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
  return (
    <>
<h1 className='text-center md:text-[32px] pt-42 text-2xl font-[600]'>Reset Password</h1>
<p className='text-center'>Please use a password you can remember</p>
 <form onSubmit={handleSubmit} className='md:w-119 w-70 flex flex-col gap-[24px] mt-9'>
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
         <Button text='Reset' />
         </form>
        <Image src='/resetbg.svg' alt='pep-svg'  width={1000} height={177} className='fixed bottom-0 z-[-1] sm:block hidden' />
    </>
  )
}

export default page