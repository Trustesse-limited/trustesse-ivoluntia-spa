
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { InputComponent } from "@/components/input";
import { Checkbox } from "@/components/ui/checkbox"
import SocialLogin from '@/components/SocialLogin';
import Button from '@/components/button'


const OrganisationPage = () => {

  //for the social icons login
    const socialIcons = [
      { img: '/google.svg', alt: 'google-svg', link: '/' },
      { img: '/apple.svg', alt: 'apple-svg', link: '/' },
      { img: '/fb.svg', alt: 'facebook-svg', link: '/' }
    ]
  
    const [form, setForm] = useState({
      email: "",
      password: "",
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
        <h1 className='md:text-[32px] pt-8 text-2xl text-center font-medium'>
          Create an Organisation account
        </h1>
        <p className='text-center'>Join Us and get volunteers</p>
  
        <form onSubmit={handleSubmit} className='md:w-119 w-70 flex flex-col gap-[24px] mt-9'>
          <InputComponent
            label="Email Address"
            placeholder="Enter your email address"
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
          <InputComponent
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            htmlFor="confirmPassword"
            type="password"
            onChange={handleChange}
            value={form.confirmPassword}
          />
  
          <div className="flex items-center space-x-2">
            <Checkbox id='terms' className='rounded-full border-black' />
            <label htmlFor="terms" className="text-sm">
              I agree to the <span className='text-[#163752]'><Link href='/'>Terms & Conditions</Link></span>
            </label>
          </div>
       <Button text='Sign up' href='/onboarding/signup/org/verify'  />
        </form>
  
        <div className="flex items-center md:w-115 w-70 mt-4">
          <div className="flex-grow border-t-2 border-black"></div>
          <span className="mx-3 text-black font-medium">Or use</span>
          <div className="flex-grow border-t-2 border-black"></div>
        </div>
  
       
  <SocialLogin icons={socialIcons}/>
        <p className='pt-2 pb-3 text-center'>
          Registered already? <span className='cursor-pointer text-[#2C6EA3] pl-1.5 font-medium'><Link href='/login'>Sign In</Link></span>
        </p>
  
        <Image src='/pep.svg' alt='pep-svg'  width={1000} height={177} className='fixed bottom-0 z-[-1] sm:block hidden' />
      </>
    )
  }


export default OrganisationPage