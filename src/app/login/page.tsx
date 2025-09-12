'use client'

import React from 'react'
import { InputComponent } from '@/components/input'
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link'
import Button from '@/components/button'
import SocialLogin from '@/components/SocialLogin'
import Image from 'next/image'
import { useState } from 'react'


const page = () => {

  //for the social icons login
  const socialIcons = [
    { img: '/google.svg', alt: 'google-svg', link: '/' },
    { img: '/apple.svg', alt: 'apple-svg', link: '/' },
    { img: '/fb.svg', alt: 'facebook-svg', link: '/' }
  ]

  const [form, setForm] = useState({
      email: "",
      password: "",
      
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
    <div>
        <h1 className='md:text-[32px] pt-20 text-2xl text-center font-[600]'>Welcome Back</h1>
        <p className='text-center'>Please enter your details</p>
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
                 <InputComponent
                  label="Password"
                  placeholder="Enter password"
                  name="password"
                  htmlFor="password"
                  type="password"
                onChange={handleChange}
                 value={form.password}
                />
                <div className='flex justify-between items-center w-full md:text-sm text-[11px] '>
                   <div className="flex items-center space-x-2">
          <Checkbox id='terms' className='rounded-full border-black' />
          <label htmlFor="terms">
            <Link href='/'>Remember Password</Link>
          </label>
        </div>
         <Link href='/forgotpassword' className='text-[#163752]'>Forgot Password</Link>
         </div>
        <Button text='Sign In' />
        </form>
        <div className="flex items-center md:w-115 w-70 mt-4">
        <div className="flex-grow border-t-2 border-black"></div>
        <span className="mx-3 text-black font-medium">Or continue with</span>
        <div className="flex-grow border-t-2 border-black"></div>
      </div>
      <SocialLogin icons={socialIcons}/>
       <p className='text-center text-[16px]'>No Account yet? <span className='text-[#2C6EA3]'><Link href="/onboarding/signup">Sign Up</Link></span></p>
    </div>
    <Image src='/pep.svg' alt='pep-svg'  width={1000} height={177} className='fixed bottom-0 z-[-1] sm:block hidden' />
    </>
  )
}

export default page