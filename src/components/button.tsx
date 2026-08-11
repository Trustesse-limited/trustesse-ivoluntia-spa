'use client'
import React from "react";
import Link from "next/link";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps {
  text: string;
  href?: string; // optional link
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, href, type = "button", disabled = false, onClick, isLoading = false }) => {
  const baseClasses =
    "bg-[#0E68DC] text-white rounded-2xl py-3 font-[600] md:text-xl text-lg cursor-pointer px-6 text-center inline-flex items-center justify-center gap-2";

  if (href) {
    // Renders a link styled like a button
    return (
      <Link href={href} className={baseClasses}>
        {text}
      </Link>
    );
  }

  return (
    <button 
      className={baseClasses} 
      type={type} 
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {text}
      {isLoading && <LoadingSpinner size="sm" />}
    </button>
  );
};

export default Button;
