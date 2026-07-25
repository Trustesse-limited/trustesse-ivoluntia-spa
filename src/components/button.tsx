'use client'
import React from "react";
import Link from "next/link";

interface ButtonProps {
  text: string;
  href?: string; // optional link
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, href, type = "button", disabled = false }) => {
  const baseClasses =
    "bg-[#0E68DC] text-white rounded-2xl py-3 font-[600] md:text-xl text-lg cursor-pointer px-6 text-center block";

  if (href) {
    // Renders a link styled like a button
    return (
      <Link href={href} className={baseClasses}>
        {text}
      </Link>
    );
  }

  return (
    <button className={baseClasses} type={type} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
