'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { InputComponent } from "@/components/input";
import { Checkbox } from "@/components/ui/checkbox"
import SocialLogin from '@/components/SocialLogin';
import Button from '@/components/button';
import { useOnboardingStore } from '@/store';
import { useAuthActions } from '@/hooks/useAuthActions';
import toast from 'react-hot-toast';
import { sanitizeEmail, sanitizePassword, isValidEmail } from '@/lib/sanitize';

const VolunteerPage = () => {
  const router = useRouter();
  const { updateFormData, switchAccountType, formData: onboardingFormData } = useOnboardingStore();
  const { volunteerSignUp, isLoading } = useAuthActions();
  const [signupEmail, setSignupEmail] = useState('');

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
    hasAcceptedTOC: false,
  });

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePassword = (password: string) => {
    if (!password) {
      return '';
    }
    
    const errors = [];
    
    if (password.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('one special character');
    }
    
    if (errors.length > 0) {
      return `Password must contain ${errors.join(', ')}`;
    }
    
    return '';
  };

  // On mount, switch to volunteer account type.
  // SECURITY: Email is NOT restored from any store on signup screens.
  useEffect(() => {
    switchAccountType('volunteer');
    
    // SECURITY: Restore TOC acceptance from store ONLY (no email from store).
    setForm((prev) => ({
      ...prev,
      hasAcceptedTOC: onboardingFormData.authInfo?.hasAcceptedTOC || false,
    }));
  }, [switchAccountType, onboardingFormData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // SECURITY: Sanitize inputs before validation
    const sanitizedEmail = sanitizeEmail(form.email);
    const sanitizedPassword = sanitizePassword(form.password);
    const sanitizedConfirmPassword = sanitizePassword(form.confirmPassword);

    if (!sanitizedEmail || !sanitizedPassword || !sanitizedConfirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!form.hasAcceptedTOC) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    // Call volunteer signup API
    const result = await volunteerSignUp({
      authInfo: {
        email: sanitizedEmail,
        password: sanitizedPassword,
        confirmPassword: sanitizedConfirmPassword,
        hasAgreedToTermsAndCondition: form.hasAcceptedTOC,
      },
    });

    if (result.success) {
      // Store email for OTP verification
      setSignupEmail(sanitizedEmail);
      
      // SECURITY: Only store non-sensitive data - passwords are never stored in client-side state
      updateFormData({
        authInfo: {
          email: sanitizedEmail,
          // Password and confirmPassword intentionally excluded for security
          hasAcceptedTOC: form.hasAcceptedTOC,
        },
        metaData: {
          accountType: "volunteer",
          currentPage: 1,
        },
      });

      // SECURITY: Clear password fields from local state after submission
      setForm((prev) => ({
        ...prev,
        email: sanitizedEmail,
        password: "",
        confirmPassword: "",
      }));

      // Redirect to OTP verification page
      router.push(`/verify?email=${encodeURIComponent(sanitizedEmail)}&type=volunteer`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // SECURITY: Sanitize as the user types (first line of defense).
    if (name === 'email') {
      setForm({ ...form, email: sanitizeEmail(value) });
    } else if (name === 'password') {
      const sanitizedPassword = sanitizePassword(value);
      setForm({ ...form, password: sanitizedPassword });
      setPasswordError(validatePassword(sanitizedPassword));
      // Also validate confirm password if it has a value
      if (form.confirmPassword) {
        setConfirmPasswordError(sanitizedPassword !== form.confirmPassword ? 'Passwords do not match' : '');
      }
    } else if (name === 'confirmPassword') {
      const sanitizedConfirmPassword = sanitizePassword(value);
      setForm({ ...form, confirmPassword: sanitizedConfirmPassword });
      setConfirmPasswordError(sanitizedConfirmPassword !== form.password ? 'Passwords do not match' : '');
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setForm({ ...form, hasAcceptedTOC: checked });
  };

  return (
    <>
           
      <h1 className='md:text-[32px] text-2xl text-center font-medium'>
        Create a Volunteer account
      </h1>
      <p className='text-center'>Join Us and start volunteering</p>

      <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-[24px] mt-9 mx-auto'>
        <InputComponent
          label="Email Address"
          placeholder="Enter your email address"
          name="email"
          htmlFor="email"
          type="email"
          onChange={handleChange}  
          value={form.email}
        />
        <div>
          <InputComponent
            label="Password"
            placeholder="Enter password"
            name="password"
            htmlFor="password"
            type="password"
            onChange={handleChange}
            value={form.password}
          />
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
        </div>
        <div>
          <InputComponent
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            htmlFor="confirmPassword"
            type="password"
            onChange={handleChange}
            value={form.confirmPassword}
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id='terms' className='rounded-full border-black' onCheckedChange={handleTermsChange} />
          <label htmlFor="terms" className="text-sm">
            I agree to the <span className='text-[#163752]'><Link href='/'>Terms & Conditions</Link></span>
          </label>
        </div>
     <Button text='Sign up' type='submit' isLoading={isLoading} disabled={isLoading} />
      </form>

      <div className="flex items-center w-full max-w-md mt-4 mx-auto">
        <div className="flex-grow border-t-2 border-black"></div>
        <span className="mx-3 text-black font-medium whitespace-nowrap">Or use</span>
        <div className="flex-grow border-t-2 border-black"></div>
      </div>

     
<SocialLogin icons={socialIcons}/>
      <p className='pt-2 pb-3 text-center'>
        Registered already? <span className='cursor-pointer text-[#2C6EA3] pl-1.5 font-medium'><Link href='/login'>Sign In</Link></span>
      </p>

      <Image src='/pep.svg' alt='pep-svg'  width={1000} height={177} className='fixed bottom-0 left-0 z-[-1] w-full h-auto object-contain pointer-events-none' />
    </>
  )
}

export default VolunteerPage