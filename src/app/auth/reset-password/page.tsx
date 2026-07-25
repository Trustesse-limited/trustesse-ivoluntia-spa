'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuthActions } from '@/hooks/useAuthActions';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const result = await resetPassword(email);

    if (result.success) {
      setMessage(result.message || 'Password reset email sent successfully');
      setEmail('');
    } else {
      setError(result.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <LoadingButton
            isLoading={isLoading}
            type="submit"
            className="w-full bg-[#0E68DC] hover:bg-[#0E68DC]/90"
          >
            Send Reset Link
          </LoadingButton>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
