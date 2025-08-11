import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, placeholder , ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      placeholder={placeholder}
      className={cn(
        "file:text-foreground w-3xs px-5 py-2.5 placeholder:text-[#626262] placeholder:text-xs selection:bg-primary item-center  selection:text-primary-foreground dark:bg-input/30 border-[#A0A0A0] flex h-12 min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#A0F2CC]",
        "aria-invalid:ring-[#F44336CC] dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input }
