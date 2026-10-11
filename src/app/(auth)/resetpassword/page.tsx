'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { InputComponent } from "@/components/input";
import { AppButton } from '@/components/AppButton';
import { sanitizePassword } from '@/lib/sanitize';
import { useAuthActions } from '@/hooks/useAuthActions';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

// Helper function to prevent duplicate toasts
const showToast: {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => void;
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => void;
} = {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => {
    toast.dismiss();
    toast.success(message, options);
  },
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => {
    toast.dismiss();
    toast.error(message, options);
  },
};

const Page = () => {
    const { forgotPassword, isLoading } = useAuthActions();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
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

    // Get email and token from URL parameters on mount
    useEffect(() => {
        const emailParam = searchParams.get('email');
        const tokenParam = searchParams.get('token');

        if (!emailParam || !tokenParam) {
            showToast.error('Invalid link. Please start over.');
            router.push('/forgotpassword');
            return;
        }

        setEmail(emailParam);
        setToken(tokenParam);
    }, [searchParams, router]);

    const isFormValid = form.newPassword.trim() !== "" && 
                        form.confirmPassword.trim() !== "" && 
                        form.newPassword === form.confirmPassword &&
                        passwordError === "" &&
                        confirmPasswordError === "";
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) {
            console.log('[RESET PASSWORD] Already submitting, ignoring duplicate call');
            return;
        }

        if (!email || !token) {
            showToast.error('Invalid link. Please start over.');
            router.push('/forgotpassword');
            return;
        }

        console.log('[RESET PASSWORD] Submitting with email:', email);
        console.log('[RESET PASSWORD] Token:', token);

        const result = await forgotPassword({
            email,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
            token
        });

        if (result.success) {
            showToast.success('Password reset successfully. Please login with your new password.');
            router.push('/login');
        }
      };
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizePassword(value);
        
        setForm({ ...form, [name]: sanitizedValue });
        
        if (name === 'newPassword') {
            setPasswordError(validatePassword(sanitizedValue));
            if (form.confirmPassword) {
                setConfirmPasswordError(
                    sanitizedValue !== form.confirmPassword 
                        ? 'Passwords do not match' 
                        : ''
                );
            }
        } else if (name === 'confirmPassword') {
            setConfirmPasswordError(
                sanitizedValue !== form.newPassword 
                    ? 'Passwords do not match' 
                    : ''
            );
        }
      };
  return (
    <>
    <div className='flex flex-col items-center w-full min-h-screen pt-20'>
      <div className='flex flex-col items-center w-full max-w-md mx-auto px-6 sm:px-4 flex-grow'>
      <h1 className='text-center md:text-[32px] text-xl sm:text-2xl font-semibold sm:mt-16'>Reset Password</h1>
      <p className='text-center text-sm sm:text-base'>Enter your new password below</p>
      <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-[24px] mt-9 mx-4 md:mx-auto'>
        <div>
          <InputComponent
            label="New Password"
            placeholder="Enter new password"
            name="newPassword"
            htmlFor="newPassword"
            type="password"
            onChange={handleChange}
            value={form.newPassword}
          />
          {passwordError && <p className='text-red-500 text-sm mt-1'>{passwordError}</p>}
        </div>
        
        <div>
          <InputComponent
            label="Confirm Password"
            placeholder="Confirm new Password"
            name="confirmPassword"
            htmlFor="confirmPassword"
            type="password"
            onChange={handleChange}
            value={form.confirmPassword}
          />
          {confirmPasswordError && <p className='text-red-500 text-sm mt-1'>{confirmPasswordError}</p>}
        </div>
        <AppButton text='Reset Password' type='submit' disabled={!isFormValid} isLoading={isLoading} />
      </form>
      </div>
      <Image src='/resetbg.svg' alt='pep-svg'  width={1920} height={350} className='w-full h-[25vh] object-contain pointer-events-none' />
    </div>
    </>
  )
}

export default Page