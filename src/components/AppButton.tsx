'use client';

import { LoadingSpinner } from './LoadingSpinner';
import { RippleEffect } from './RippleEffect';
import { ReactNode, useState } from 'react';
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
  const [isPressed, setIsPressed] = useState(false);
  const getVariantClasses = () => {
    switch (variant) {
      case 'custom':
        return 'custom';
      case 'danger':
        return disabled || isLoading
          ? 'bg-red-500 text-white'
          : 'bg-red-500 text-white hover:bg-red-600';
      case 'outline':
        return disabled || isLoading
          ? 'bg-transparent border-2 border-[var(--buttonPrimary)] text-[var(--buttonPrimary)]'
          : 'bg-transparent border-2 border-[var(--buttonPrimary)] text-[var(--buttonPrimary)] hover:bg-[var(--buttonPrimary)] hover:text-white';
      case 'secondary':
        return disabled || isLoading
          ? 'bg-blue-400 text-white'
          : 'bg-blue-400 text-white hover:bg-blue-500';
      case 'link':
        return disabled || isLoading
          ? 'bg-transparent text-[var(--buttonPrimary)] p-0'
          : 'bg-transparent text-[var(--buttonPrimary)] hover:underline p-0';
      default:
        return disabled || isLoading
          ? 'bg-[#0E68DC] text-white'
          : 'bg-[#0E68DC] text-white hover:bg-[#0a55b0]';
    }
  };

  const getShadowStyles = () => {
    if (variant === 'custom' || variant === 'link' || variant === 'outline') {
      return {};
    }

    if (isPressed) {
      return {
        boxShadow: `0 1px 2px rgba(0, 0, 0, 0.1)`,
        transform: 'scale(0.98)',
      };
    }

    return {
      boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
    };
  };

  const baseClasses = getVariantClasses() === 'custom' ? '' : `${getVariantClasses()} rounded-2xl py-3 font-[600] text-sm sm:text-base md:text-xl px-3 sm:px-6 text-center inline-flex items-center justify-center gap-1 sm:gap-2 transition-all duration-150`;
  const disabledClasses = "opacity-50 cursor-not-allowed";
  const enabledClasses = "cursor-pointer";

  const cursorClasses = disabled || isLoading ? disabledClasses : enabledClasses;
  const shadowStyles = getShadowStyles();

  const handleMouseDown = () => {
    if (!disabled && !isLoading && variant !== 'custom' && variant !== 'link' && variant !== 'outline') {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const buttonContent = isLoading ? (
    <>
      {text || children}
      <LoadingSpinner size="sm" opacity={0.9} withSpacing={true} className="w-3 h-3 sm:w-4 sm:h-4 border-2" />
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
        style={shadowStyles}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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
        style={shadowStyles}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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
      style={shadowStyles}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative z-10 w-full h-full inline-flex items-center justify-center pointer-events-none">
        {buttonContent}
      </div>
    </RippleEffect>
  );
}
