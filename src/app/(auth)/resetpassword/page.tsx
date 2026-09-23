'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { InputComponent } from "@/components/input";
import { AppButton } from '@/components/AppButton';
import { sanitizePassword } from '@/lib/sanitize';
import { useAuthActions } from '@/hooks/useAuthActions';
import toast from 'react-hot-toast';
import Image from 'next/image';

const Page = () => {
    const { forgotPassword, isLoading } = useAuthActions();
    const router = useRouter();

    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Get cookie value
    const getCookie = (name: string): string | null => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    // Clear cookie
    const clearCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

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

    // Check for cookies on mount
    useEffect(() => {
        const emailCookie = getCookie('reset_email');
        const otpCookie = getCookie('reset_otp');
        
        if (!emailCookie || !otpCookie) {
            toast.error('Session expired. Please start over.');
            router.push('/forgotpassword');
            return;
        }
        
        setEmail(emailCookie);
        setToken(otpCookie);
    }, [router]);

    const isFormValid = form.newPassword.trim() !== "" && 
                        form.confirmPassword.trim() !== "" && 
                        form.newPassword === form.confirmPassword &&
                        passwordError === "" &&
                        confirmPasswordError === "";
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !token) {
            toast.error('Session expired. Please start over.');
            router.push('/forgotpassword');
            return;
        }

        const result = await forgotPassword({
            email,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
            token
        });

        if (result.success) {
            // Clear cookies on success
            clearCookie('reset_email');
            clearCookie('reset_otp');
            toast.success('Password reset successfully. Please login with your new password.');
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
      <div className='flex flex-col items-center w-full max-w-md mx-auto px-4 flex-grow'>
      <h1 className='text-center md:text-[32px] text-2xl font-[600] mt-16'>Reset Password</h1>
      <p className='text-center'>Enter your new password below</p>
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