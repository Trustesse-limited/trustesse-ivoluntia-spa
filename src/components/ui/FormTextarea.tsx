'use client';

import * as React from 'react';
import { FormField } from './FormField';

interface FormTextareaProps extends Omit<React.ComponentProps<'textarea'>, 'rows'> {
  label?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}

export function FormTextarea({
  label,
  required = false,
  error,
  rows = 4,
  className = '',
  ...props
}: FormTextareaProps) {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <textarea
        rows={rows}
        className={`w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#42A5F5] focus:ring-2 focus:ring-[#42A5F5]/20 transition-all duration-200 resize-none ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
        {...props}
      />
    </FormField>
  );
}
