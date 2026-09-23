'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppButton } from '@/components/AppButton';
import { useAuthStore } from '@/store';

export default function NotFound() {
  const router = useRouter();
  const { user } = useAuthStore();

  const getButtonProps = () => {
    if (!user) {
      return {
        text: 'Sign In',
        onClick: () => router.replace('/login'),
      };
    }

    const accountType = user.accountType?.toLowerCase();

    switch (accountType) {
      case 'volunteer':
        return {
          text: 'Go Home',
          onClick: () => router.replace('/home'),
        };
      case 'organization':
        return {
          text: 'Dashboard',
          onClick: () => router.replace('/org/dashboard'),
        };
      case 'admin':
        return {
          text: 'Admin Dashboard',
          onClick: () => router.replace('/admin/dashboard'),
        };
      default:
        return {
          text: 'Go Home',
          onClick: () => router.replace('/'),
        };
    }
  };

  const buttonProps = getButtonProps();
  const isAuthenticated = !!user;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative p-4 mx-auto">
      {/* Main Content - centered */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-[700] text-center mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-[600] text-center mb-4">
          Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-[#666666] text-center mb-8 max-w-md leading-relaxed">
          {isAuthenticated 
            ? "The page you are looking for was not found"
            : "The page you are looking for was not found. Please sign in to access your account."
          }
        </p>

        {/* Action Button */}
        <div className="w-full flex justify-center">
          <AppButton
            text={buttonProps.text}
            onClick={buttonProps.onClick}
            className="w-full max-w-sm"
          />
        </div>

        {/* Additional help text */}
        <p className="mt-8 text-xs sm:text-sm text-center text-[#999999]">
          If you believe this is an error, please contact support
        </p>
      </div>

      {/* Illustration - fixed at bottom center */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-[446px] flex justify-center">
        <Image
          src="/user.svg"
          alt="illustration-svg"
          width={446}
          height={223}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
