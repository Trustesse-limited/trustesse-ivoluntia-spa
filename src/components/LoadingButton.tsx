'use client';

import { Button } from './ui/button';
import { LoadingSpinner } from './LoadingSpinner';
import { ReactNode } from 'react';

interface LoadingButtonProps {
  isLoading: boolean;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'disabled' | 'outline' | 'secondary' | 'clicked' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({
  isLoading,
  children,
  disabled = false,
  className = '',
  variant = 'default',
  size = 'default',
  onClick,
  type = 'button',
}: LoadingButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${className} relative`}
      style={{
        backgroundColor: variant === 'default' ? '#0E68DC' : undefined,
      }}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </span>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </Button>
  );
}
