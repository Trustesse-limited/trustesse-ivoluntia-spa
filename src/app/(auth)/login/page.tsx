'use client'

import React, { useState, useEffect } from 'react'
import { InputComponent } from '@/components/input'
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link'
import Button from '@/components/button'
import SocialLogin from '@/components/SocialLogin'
import Image from 'next/image'
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { sanitizeEmail, sanitizePassword, isValidEmail } from '@/lib/sanitize';
import { getRememberMe, saveRememberMe, clearRememberMe, hasRememberMe } from '@/lib/rememberMe';

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

  // SECURITY: On mount, restore email AND decrypted password
  // ONLY if the user previously opted in via the "Remember me" checkbox.
  // Password is encrypted with AES-GCM and decrypted on this device only.
  useEffect(() => {
    const restoreRememberMe = async () => {
      if (hasRememberMe()) {
        const { email, password } = await getRememberMe();
        if (email) {
          setForm((prev) => ({ ...prev, email, password, rememberMe: true }));
        }
      }
    };
    restoreRememberMe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // SECURITY: Sanitize inputs before validation/submission
    const sanitizedEmail = sanitizeEmail(form.email);
    const sanitizedPassword = sanitizePassword(form.password);

    if (!sanitizedEmail || !sanitizedPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // SECURITY: Persist email + encrypted password ONLY when "Remember me" is explicitly ticked.
    // Password is encrypted with AES-GCM using a device-specific key.
    if (form.rememberMe) {
      await saveRememberMe(sanitizedEmail, sanitizedPassword);
    } else {
      clearRememberMe();
    }

    // Call the API
    const result = await login({
      email: sanitizedEmail,
      password: sanitizedPassword,
      rememberMe: form.rememberMe,
      twoFactorCode: undefined,
      deviceInfo: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    });
    
    if (result.success) {
      // SECURITY: Determine redirect based on onboarding status from API response
      const loginData = result.data as Record<string, unknown> | undefined;
      const hasCompletedOnboarding = loginData?.hasCompletedOnboarding as boolean | undefined;
      const lastCompletedPage = loginData?.lastCompletedPage as number | undefined;
      const accountType = loginData?.accountType as string | undefined;

      if (hasCompletedOnboarding) {
        // User completed onboarding, redirect to dashboard
        router.push('/dashboard');
      } else {
        // Redirect to unified onboarding page with step param if resuming
        const stepParam = lastCompletedPage && lastCompletedPage > 0 ? `?step=${lastCompletedPage}` : '';
        router.push(`/onboarding${stepParam}`);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // SECURITY: Sanitize as the user types (first line of defense).
    // Emails are lowercased + stripped of dangerous payloads;
    // passwords only have control characters stripped (characters preserved).
    if (name === 'email') {
      setForm({ ...form, email: sanitizeEmail(value) });
    } else if (name === 'password') {
      setForm({ ...form, password: sanitizePassword(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setForm({ ...form, rememberMe: checked });
    // SECURITY: If user unchecks "Remember me", immediately remove stored data.
    if (!checked) {
      clearRememberMe();
    }
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
          <Checkbox id='remember-me' className='rounded-full border-black' checked={form.rememberMe} onCheckedChange={handleRememberMeChange} />
          <label htmlFor="remember-me">
            <Link href='/'>Remember me</Link>
          </label>
        </div>
         <Link href='/forgotpassword' className='text-[#163752]'>Forgot Password</Link>
         </div>
        <Button text='Sign In' type='submit' isLoading={isLoading} disabled={isLoading} />
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