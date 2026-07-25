'use client'

import React, { useState } from 'react'
import { InputComponent } from '@/components/input'
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link'
import Button from '@/components/button'
import SocialLogin from '@/components/SocialLogin'
import Image from 'next/image'
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const Page = () => {
  const router = useRouter();
  const { login, isLoading } = useAuthActions();

  //for the social icons login
  const socialIcons = [
    { img: '/google.svg', alt: 'google-svg', link: '/' },
    { img: '/apple.svg', alt: 'apple-svg', link: '/' },
    { img: '/fb.svg', alt: 'facebook-svg', link: '/' }
  ]

  const [form, setForm] = useState({
      email: "",
      password: "",
      rememberMe: false,
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Call the API
    const result = await login({
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe,
      twoFactorCode: undefined,
      deviceInfo: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    });
    
    if (result.success) {
      // Redirect to dashboard
      router.push('/dashboard');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRememberMeChange = (checked: boolean) => {
    setForm({ ...form, rememberMe: checked });
  };

  return (
    <>
      <h1 className='md:text-[32px] text-2xl text-center font-[600]'>Welcome Back</h1>
      <p className='text-center'>Please enter your details</p>
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
          <Checkbox id='terms' className='rounded-full border-black' onCheckedChange={handleRememberMeChange} />
          <label htmlFor="terms">
            <Link href='/'>Remember Password</Link>
          </label>
        </div>
         <Link href='/forgotpassword' className='text-[#163752]'>Forgot Password</Link>
         </div>
        <Button text={isLoading ? 'Signing in...' : 'Sign In'} type='submit' disabled={isLoading} />
        </form>
        <div className="flex items-center w-full max-w-md mt-4 mx-auto">
        <div className="flex-grow border-t-2 border-black"></div>
        <span className="mx-3 text-black font-medium whitespace-nowrap">Or continue with</span>
        <div className="flex-grow border-t-2 border-black"></div>
      </div>
      <SocialLogin icons={socialIcons}/>
       <p className='text-center text-[16px] mt-4'>No Account yet?{" "}
       <span className='text-[#2C6EA3]'>
         <Link href="/">Sign Up</Link>
       </span>
       </p>
      <Image src='/pep.svg' alt='pep-svg'  width={1000} height={177} className='fixed bottom-0 left-0 z-[-1] w-full h-auto object-contain pointer-events-none' />
    </>
  )
}

export default Page
