import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";

interface BackButtonProps {
  text?: string;
  className?: string;
  to?: string; // Custom navigation path. If provided, navigates to this path instead of going back
}

export default function BackButton({ text = "Back", className = "", to }: BackButtonProps) {
  return (
    <Link
      href={to || "/"}
      className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-2 bg-gray-100 cursor-pointer rounded-md text-gray-600 hover:text-gray-900 transition-colors min-h-11 min-w-11 select-none ${className}`}
    >
      <FiChevronLeft className="text-lg" />
      <span className="hidden sm:inline text-sm font-medium">{text}</span>
    </Link>
  );
}
