'use client'
import React from "react";
import Link from "next/link";

interface ButtonProps {
  text: string;
  href?: string; // optional link
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ text, href, type = "button" }) => {
  const baseClasses =
    "bg-[#0E68DC] text-white rounded-2xl py-4 font-[600] md:text-2xl text-xl cursor-pointer px-6 text-center block";

  if (href) {
    // Renders a link styled like a button
    return (
      <Link href={href} className={baseClasses}>
        {text}
      </Link>
    );
  }

  return (
    <button className={baseClasses} type={type}>
      {text}
    </button>
  );
};

export default Button;
