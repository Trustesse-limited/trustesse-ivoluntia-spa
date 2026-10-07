'use client';

import React, { useState, useEffect, useCallback } from 'react'
import { InputComponent } from '@/components/input'
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link'
import { AppButton } from '@/components/AppButton'
import SocialLogin from '@/components/SocialLogin'
import Image from 'next/image'
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { sanitizeEmail, sanitizePassword, isValidEmail } from '@/lib/sanitize';
import { getRememberMe, saveRememberMe, clearRememberMe, hasRememberMe } from '@/lib/rememberMe';

const LoginPageClient = () => {
  const router = useRouter();
  const { login, isLoading } = useAuthActions();

  const socialIcons = [
    { img: '/google.svg', alt: 'google-svg', link: '/' },
    { img: '/apple.svg', alt: 'apple-svg', link: '/' },
    { img: '/fb.svg', alt: 'facebook-svg', link: '/' }
  ]

  const [form, setForm] = useState({
      email: "",
      password: "",
      rememberMe: false,
      twoFactorCode: "",
    });

  const isFormValid = form.email.trim() !== "" && form.password.trim() !== "";

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
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

    if (form.rememberMe) {
      await saveRememberMe(sanitizedEmail, sanitizedPassword);
    } else {
      clearRememberMe();
    }

    const result = await login({
      email: sanitizedEmail,
      password: sanitizedPassword,
      rememberMe: form.rememberMe,
      twoFactorCode: form.twoFactorCode || undefined,
      deviceInfo: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    });
    
    if (result.success) {
      const resultData = result as { redirect?: string; requiresOnboarding?: boolean; accountType?: string; lastCompletedPage?: number; hasCompletedOnboarding?: boolean; requiresTwoFactor?: boolean };
      
      if (resultData.requiresTwoFactor) {
        if (resultData.redirect) {
          router.push(resultData.redirect);
        }
        return;
      }
      
      if (resultData.redirect) {
        router.push(resultData.redirect);
        return;
      } else {
        const loginData = result.data as Record<string, unknown> | undefined;
        const hasCompletedOnboarding = loginData?.hasCompletedOnboarding as boolean | undefined;
        const accountType = loginData?.accountType as string | undefined;
        const normalizedAccountType = accountType?.toLowerCase();

        if (hasCompletedOnboarding) {
          if (normalizedAccountType === 'organization') {
            router.push('/org/dashboard');
          } else if (normalizedAccountType === 'volunteer') {
            router.push('/home');
          } else if (normalizedAccountType === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/home');
          }
        } else {
          if (normalizedAccountType === 'organization') {
            router.push('/onboarding?type=organization');
          } else if (normalizedAccountType === 'volunteer') {
            router.push('/onboarding?type=volunteer');
          } else {
            router.push('/onboarding');
          }
        }
      }
    } else {
      const resultData = result as { requiresVerification?: boolean; emailForVerification?: string; redirect?: string };
      if (resultData.requiresVerification && resultData.redirect) {
        router.push(resultData.redirect);
      }
    }
  }, [form, login, router]);

  useEffect(() => {
    const restoreRememberMe = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const emailFromUrl = urlParams.get('email');
      const otpFromUrl = urlParams.get('otp');
      const completeLogin = urlParams.get('completeLogin');
      
      if (emailFromUrl) {
        setForm((prev) => ({ ...prev, email: emailFromUrl }));
        
        if (otpFromUrl && completeLogin === 'true') {
          setForm((prev) => ({ ...prev, twoFactorCode: otpFromUrl }));
          setTimeout(() => {
            const formElement = document.querySelector('form') as HTMLFormElement;
            if (formElement) {
              formElement.requestSubmit();
            }
          }, 100);
        }
        return;
      }
      
      if (hasRememberMe()) {
        const { email, password } = await getRememberMe();
        if (email) {
          setForm((prev) => ({ ...prev, email, password, rememberMe: true }));
        }
      }
    };
    restoreRememberMe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    if (!checked) {
      clearRememberMe();
    }
  };

  return (
    <>
    <div className='flex flex-col items-center w-full min-h-screen pt-20'>
      <div className='flex flex-col items-center w-full max-w-md mx-auto px-6 sm:px-4 flex-grow'>
      <h1 className='md:text-[32px] text-xl sm:text-2xl text-center font-[600] sm:mt-16'>Welcome Back</h1>
      <p className='text-center text-sm sm:text-base'>Please enter your details</p>
      <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-6 mt-9 md:mx-auto'>
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
         <Link href='/forgotpassword' className='text-[#163752] font-medium hover:underline'>Forgot Password</Link>
         </div>
        <AppButton text='Sign In' type='submit' isLoading={isLoading} disabled={isLoading || !isFormValid} />
        </form>
        <div className="flex items-center w-full max-w-md mt-4 mx-auto">
        <div className="flex-grow border-t-2 border-black"></div>
        <span className="mx-3 text-black font-medium whitespace-nowrap">Or continue with</span>
        <div className="flex-grow border-t-2 border-black"></div>
      </div>
      <SocialLogin icons={socialIcons}/>
       <p className='text-center text-[16px] font-medium mt-4'>No Account yet?{" "}
       <span className='text-[#2C6EA3]'>
         <Link href="/" className="hover:underline">Sign Up</Link>
       </span>
       </p>
      </div>
      <Image src='/pep.svg' alt='pep-svg'  width={1920} height={350} className='w-full h-[25vh] object-contain pointer-events-none' />
    </div>
  </>
  );
};

export default LoginPageClient;
