'use client';

import * as React from 'react';
import { FormField } from './FormField';

interface FormInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string;
  required?: boolean;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  className?: string;
}

export function FormInput({
  label,
  required = false,
  error,
  type = 'text',
  className = '',
  ...props
}: FormInputProps) {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <input
        type={type}
        className={`w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#42A5F5] focus:ring-2 focus:ring-[#42A5F5]/20 transition-all duration-200 ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
        {...props}
      />
    </FormField>
  );
}
