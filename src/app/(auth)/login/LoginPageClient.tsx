'use client';

import React, { useState, useEffect } from 'react'
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
import logger from '@/lib/logger';

const LoginPageClient = () => {
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

  const isFormValid = form.email.trim() !== "" && form.password.trim() !== "";

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
      // Use the enhanced redirect information from the login hook
      const resultData = result as { redirect?: string; requiresOnboarding?: boolean; accountType?: string; lastCompletedPage?: number; hasCompletedOnboarding?: boolean };
      
      logger.log('[Login Page] Login successful, resultData:', resultData);
      logger.log('[Login Page] resultData.redirect:', resultData.redirect);
      logger.log('[Login Page] resultData.accountType:', resultData.accountType);
      
      if (resultData.redirect) {
        logger.log('[Login Page] Redirecting to:', resultData.redirect, 'Account Type:', resultData.accountType);
        logger.log('[Login Page] Calling router.push to:', resultData.redirect);
        router.push(resultData.redirect);
        return; // Important: return early to prevent fallback logic
      } else {
        logger.log('[Login Page] No redirect provided, using fallback logic');
        // Fallback to original logic if redirect not provided
        const loginData = result.data as Record<string, unknown> | undefined;
        const hasCompletedOnboarding = loginData?.hasCompletedOnboarding as boolean | undefined;
        const lastCompletedPage = loginData?.lastCompletedPage as number | undefined;
        const accountType = loginData?.accountType as string | undefined;
        const normalizedAccountType = accountType?.toLowerCase();

        logger.log('[Login Page] Fallback - hasCompletedOnboarding:', hasCompletedOnboarding);
        logger.log('[Login Page] Fallback - accountType:', accountType);
        logger.log('[Login Page] Fallback - normalizedAccountType:', normalizedAccountType);

        if (hasCompletedOnboarding) {
          // User completed onboarding, redirect to appropriate dashboard
          if (normalizedAccountType === 'organization') {
            logger.log('[Login Page] Fallback redirect to /org/dashboard');
            router.push('/org/dashboard');
          } else if (normalizedAccountType === 'volunteer') {
            logger.log('[Login Page] Fallback redirect to /home');
            router.push('/home');
          } else if (normalizedAccountType === 'admin') {
            logger.log('[Login Page] Fallback redirect to /admin/dashboard');
            router.push('/admin/dashboard');
          } else {
            logger.log('[Login Page] Fallback redirect to /home');
            router.push('/home');
          }
        } else {
          // Redirect to appropriate onboarding based on account type
          if (normalizedAccountType === 'organization') {
            logger.log('[Login Page] Fallback redirect to /onboarding?type=organization');
            router.push('/onboarding?type=organization');
          } else if (normalizedAccountType === 'volunteer') {
            logger.log('[Login Page] Fallback redirect to /onboarding?type=volunteer');
            router.push('/onboarding?type=volunteer');
          } else {
            logger.log('[Login Page] Fallback redirect to /onboarding');
            router.push('/onboarding');
          }
        }
      }
    } else {
      // Check if login failed due to account not active requiring verification
      const resultData = result as { requiresVerification?: boolean; emailForVerification?: string; redirect?: string };
      if (resultData.requiresVerification && resultData.redirect) {
        logger.log('[Login Page] Account not active, redirecting to verification');
        router.push(resultData.redirect);
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
    <div className='flex flex-col items-center w-full min-h-screen pt-20'>
      <div className='flex flex-col items-center w-full max-w-md mx-auto px-4 flex-grow'>
      <h1 className='md:text-[32px] text-2xl text-center font-[600] mt-16'>Welcome Back</h1>
      <p className='text-center'>Please enter your details</p>
      <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-[24px] mt-9 md:mx-auto'>
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
