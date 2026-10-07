'use client';

import * as React from 'react';
import { FormField } from './FormField';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label?: string;
  required?: boolean;
  error?: string;
  options: FormSelectOption[];
  placeholder?: string;
  className?: string;
  value?: string;
  onChange: (value: string) => void;
}

export function FormSelect({
  label,
  required = false,
  error,
  options,
  placeholder = 'Select an option',
  className = '',
  value,
  onChange,
}: FormSelectProps) {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:border-[#42A5F5] focus:ring-2 focus:ring-[#42A5F5]/20 transition-all duration-200 ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
