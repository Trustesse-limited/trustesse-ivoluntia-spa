
'use client'
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

interface OtpInputProps {
  length?: number;
  onChangeOtp: (otp: string) => void;
  onComplete?: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChangeOtp, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    // accept only numbers
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // keep only last digit
    setOtp(newOtp);

    // move to next input if not last
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    const otpString = newOtp.join("");
    onChangeOtp(otpString);
    
    // Trigger onComplete when all digits are filled
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only accept numeric paste
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.slice(0, length).split('');
    const newOtp = [...otp];
    
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    
    setOtp(newOtp);
    const otpString = newOtp.join('');
    onChangeOtp(otpString);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = digits.length;
    if (nextEmptyIndex < length) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
    
    // Trigger onComplete when all digits are filled
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  return (
    <div className="flex gap-2">
      {otp.map((digit: string, i: number) => (
      <input
  key={i}
  type="text"
  maxLength={1} // must be number, not string
  value={digit}
  ref={(el: HTMLInputElement | null) => {
  inputRefs.current[i] = el;
}}

  onChange={e => handleChange(e, i)}
  onKeyDown={e => handleKeyDown(e, i)}
  onPaste={handlePaste}
  className="sm:w-12 w-10  h-12 text-center border rounded-md text-xl  focus:outline-none focus:ring-2 mt-8  focus:ring-blue-500"
/>

      ))}
    </div>
  );
};

export default OtpInput;
