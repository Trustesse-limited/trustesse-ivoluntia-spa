"use client";
import { useState } from "react";
    import { Label } from "@/components/ui/label";
    import { Input } from "@/components/ui/input";
    import { Eye, EyeOff } from "lucide-react";

    interface InputComponentProps {
      label: string;
      placeholder?: string;
      name: string;
      htmlFor: string;
      type?: string;
    }

    export function InputComponent({
      label,
      placeholder,
      name,
      htmlFor,
      type = "text",
    }: InputComponentProps) {
      const [showPassword, setShowPassword] = useState(false);
      const isPassword = type === "password";

      return (
        <div className="grid gap-2 relative">
          <Label htmlFor={htmlFor} className="font-normal text-[#212121]">
            {label}
          </Label>
          <div className="relative ">
            <Input
              id={htmlFor}
              name={name}
              placeholder={placeholder}
              type={isPassword && showPassword ? "text" : type}
              className={isPassword ? "pr-10" : ""}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        </div>
      );
    }
