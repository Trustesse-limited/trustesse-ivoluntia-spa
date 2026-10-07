'use client';

import * as React from 'react';
import { FormField } from './FormField';

interface TagInputProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  className?: string;
}

export function TagInput({
  label,
  required = false,
  placeholder = 'Enter a value',
  values,
  onAdd,
  onRemove,
  className = '',
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <FormField label={label} required={required} className={className}>
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 placeholder:text-muted-foreground focus:border-[#42A5F5] focus:ring-2 focus:ring-[#42A5F5]/20 transition-all duration-200"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-5 py-3 rounded-xl bg-[#42A5F5] text-white font-medium hover:bg-[#42A5F5]/90 transition-colors duration-200"
        >
          Add
        </button>
      </div>
      
      {values.length > 0 && (
        <div className="space-y-2">
          {values.map((value, index) => (
            <div key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-xl">
              <span className="text-sm text-foreground">{value}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-destructive hover:text-destructive/80 text-sm font-medium transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </FormField>
  );
}
