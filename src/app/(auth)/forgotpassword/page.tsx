'use client'
import React from 'react'
import Image from 'next/image'
import { InputComponent } from "@/components/input";
import Button from '@/components/button'
import { useState } from 'react'


const Page = () => {

    const [form, setForm] = useState({
        email: "",
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted:", form);
      };
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
                
        <Button text='Send Link'  />
    </form>
    <Image src='/passwordbg.svg' alt='pep-svg'  width={1000} height={177} className='fixed bottom-0 left-0 z-[-1] w-full h-auto object-contain pointer-events-none' />
    </>
  )
}

export default Page