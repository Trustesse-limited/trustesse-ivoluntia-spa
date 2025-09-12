
'use client'
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

interface OtpInputProps {
  length?: number;
  onChangeOtp: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChangeOtp }) => {
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
    onChangeOtp(newOtp.join(""));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
  className="sm:w-12 w-10  h-12 text-center border rounded-md text-xl  focus:outline-none focus:ring-2 mt-8  focus:ring-blue-500"
/>

      ))}
    </div>
  );
};

export default OtpInput;
