'use client';

import { FiCalendar } from 'react-icons/fi';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  label,
  required = false,
  className = '',
}: DatePickerProps) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#42A5F5] focus:ring-2 focus:ring-[#42A5F5]/20 transition-all duration-200 cursor-pointer"
          required={required}
        />
        {!value && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <FiCalendar className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
