'use client';

import { LoadingSpinner } from './LoadingSpinner';
import { RippleEffect } from './RippleEffect';
import { ReactNode } from 'react';
import Link from 'next/link';

interface AppButtonProps {
  isLoading?: boolean;
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'disabled' | 'outline' | 'secondary' | 'clicked' | 'link' | 'danger' | 'custom';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  text?: string;
}

export function AppButton({
  isLoading = false,
  children,
  icon,
  disabled = false,
  className = '',
  variant = 'default',
  onClick,
  type = 'button',
  href,
  text,
}: AppButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'custom':
        return 'custom';
      case 'danger':
        return disabled || isLoading 
          ? 'bg-[var(--buttonDanger)] text-white' 
          : 'bg-[var(--buttonDanger)] text-white hover:bg-[var(--buttonDangerHover)]';
      case 'outline':
        return disabled || isLoading 
          ? 'bg-transparent border-2 border-[var(--buttonPrimary)] text-[var(--buttonPrimary)]' 
          : 'bg-transparent border-2 border-[var(--buttonPrimary)] text-[var(--buttonPrimary)] hover:bg-[var(--buttonPrimary)] hover:text-white';
      case 'secondary':
        return disabled || isLoading 
          ? 'bg-[var(--primary)] text-white' 
          : 'bg-[var(--primary)] text-white hover:opacity-90';
      case 'link':
        return disabled || isLoading 
          ? 'bg-transparent text-[var(--buttonPrimary)] p-0' 
          : 'bg-transparent text-[var(--buttonPrimary)] hover:underline p-0';
      default:
        return disabled || isLoading 
          ? 'bg-[var(--buttonPrimary)] text-white' 
          : 'bg-[var(--buttonPrimary)] text-white hover:opacity-90';
    }
  };

  const baseClasses = getVariantClasses() === 'custom' ? '' : `${getVariantClasses()} rounded-2xl py-3 font-[600] md:text-xl text-lg px-6 text-center inline-flex items-center justify-center gap-2 transition-class`;
  const disabledClasses = "opacity-50 cursor-not-allowed";
  const enabledClasses = "cursor-pointer";

  const cursorClasses = disabled || isLoading ? disabledClasses : enabledClasses;

  const buttonContent = isLoading ? (
    <>
      {text || children}
      <LoadingSpinner size="sm" />
    </>
  ) : (
    <>
      {text || children}
      {icon && <span className="ml-2 flex items-center">{icon}</span>}
    </>
  );

  // If variant is custom, render as plain button without any default styling
  if (variant === 'custom') {
    return (
      <button 
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={`${cursorClasses} ${disabled || isLoading ? 'opacity-50' : ''} ${className}`}
      >
        {buttonContent}
      </button>
    );
  }

  // If href is provided, render as Link
  if (href) {
    return (
      <RippleEffect
        disabled={disabled || isLoading}
        className={`${baseClasses} ${cursorClasses} ${disabled || isLoading ? 'opacity-50' : ''} ${className}`}
      >
        <Link href={href} className="relative z-10 w-full h-full inline-flex items-center justify-center pointer-events-none">
          {buttonContent}
        </Link>
      </RippleEffect>
    );
  }

  // If type is submit, render as button element for form submission (no ripple effect to allow form submission)
  if (type === 'submit') {
    return (
      <button 
        type="submit" 
        disabled={disabled || isLoading}
        className={`${baseClasses} ${cursorClasses} ${disabled || isLoading ? 'opacity-50' : ''} ${className} inline-flex items-center justify-center`}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <RippleEffect
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${cursorClasses} ${disabled || isLoading ? 'opacity-50' : ''} ${className}`}
    >
      <div className="relative z-10 w-full h-full inline-flex items-center justify-center pointer-events-none">
        {buttonContent}
      </div>
    </RippleEffect>
  );
}
