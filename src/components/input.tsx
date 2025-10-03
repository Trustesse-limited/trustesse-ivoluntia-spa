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
      value?: string;
       onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }

    export function InputComponent({
      label,
      placeholder,
      name,
      htmlFor,
      type = "text",
      value,
       onChange ,
    }: InputComponentProps) {
      const [showPassword, setShowPassword] = useState(false);
      const isPassword = type === "password";

      return (
        <div className="grid gap-2 relative">
          <Label htmlFor={htmlFor} className="font-normal text-[#000000]">
            {label}
          </Label>
          <div className="relative ">
            <Input
              id={htmlFor}
              name={name}
              placeholder={placeholder}
              type={isPassword && showPassword ? "text" : type}
              className={`${isPassword ? "pr-10" : ""} rounded-[5px] flex-1 w-full`}
              value={value}
               onChange={onChange}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-0 bottom-0 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20}  color="black" /> : <Eye size={28} stroke="white" fill='black' />}
              </button>
            )}
          </div>
        </div>
      );
    }
