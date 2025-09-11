'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { InputComponent } from "@/components/input";
import Button from '@/components/button'
import { useState } from 'react'


const page = () => {

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
<h1 className='text-center md:text-[32px] pt-50 text-2xl font-[600]'>Forgot Password?</h1>
<p className='text-center'>Dont worry, we will send you a reset link</p>
 <form onSubmit={handleSubmit} className='md:w-119 w-70 flex flex-col gap-[24px] mt-9'>
         <InputComponent
                  label="Email Address"
                  placeholder="Enter email address"
                  name="email"
                  htmlFor="email"
                  type="email"
                  onChange={handleChange}
                   value={form.email}
                />
                
        <Button text='Send Link' />
    </form>
    <Image src='/passwordbg.svg' alt='pep-svg'  width={1000} height={177} className='fixed bottom-0 z-[-1] sm:block hidden' />
        </>
  )
}

export default page