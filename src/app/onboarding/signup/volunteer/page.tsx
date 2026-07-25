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

const VolunteerPage = () => {
  const router = useRouter();
  const { updateFormData, setCurrentStep, switchAccountType, checkOnboardingStatus, formData: onboardingFormData } = useOnboardingStore();
  const { volunteerSignUp, isLoading } = useAuthActions();

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

  // On mount, switch to volunteer account type and restore data
  useEffect(() => {
    switchAccountType('volunteer');
    
    // Restore auth info from store if available
    if (onboardingFormData.authInfo) {
      setForm({
        email: onboardingFormData.authInfo.email || "",
        password: onboardingFormData.authInfo.password || "",
        confirmPassword: onboardingFormData.authInfo.confirmPassword || "",
        hasAcceptedTOC: onboardingFormData.authInfo.hasAcceptedTOC || false,
      });
    }
  }, [switchAccountType, onboardingFormData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!form.hasAcceptedTOC) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    // Set account type and step
    switchAccountType('volunteer');
    
    // Store auth info in onboarding store
    updateFormData({
      authInfo: {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        hasAcceptedTOC: form.hasAcceptedTOC,
      },
      metaData: {
        accountType: "volunteer",
        currentPage: 1,
      },
    });
    
    // Check if user has previous onboarding progress and redirect to last step
    const { shouldRedirect, route } = checkOnboardingStatus('volunteer');
    if (shouldRedirect) {
      router.push(route);
    } else {
      // No previous progress, go to first onboarding step
      setCurrentStep(1);
      router.push('/onboarding/volunteer');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          <Checkbox id='terms' className='rounded-full border-black' onCheckedChange={handleTermsChange} />
          <label htmlFor="terms" className="text-sm">
            I agree to the <span className='text-[#163752]'><Link href='/'>Terms & Conditions</Link></span>
          </label>
        </div>
     <Button text={isLoading ? 'Signing up...' : 'Sign up'} type='submit' disabled={isLoading} />
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
