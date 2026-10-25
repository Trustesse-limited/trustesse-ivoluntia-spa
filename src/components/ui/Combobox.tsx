"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select or type...",
  className = "",
  label,
  required = false,
  disabled = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const comboboxRef = React.useRef<HTMLDivElement>(null);

  // Update input value when prop value changes externally
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.value.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectOption = (optionValue: string) => {
    setInputValue(optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative", className)} ref={comboboxRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-[#42A5F5] focus:ring-2 focus:ring-[#42A5F5]/20 transition-all duration-200 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsUpDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={cn(
                  "flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-accent transition-colors text-sm",
                  inputValue === option.value && "bg-accent"
                )}
              >
                <span className="text-foreground">{option.label}</span>
                {inputValue === option.value && (
                  <Check className="h-4 w-4 text-foreground" />
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
