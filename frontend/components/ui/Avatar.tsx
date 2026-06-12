"use client";

import { useState } from "react";
import Image from "next/image";
import { generateInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  const initials = generateInitials(name);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 font-bold text-slate-600 select-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300",
        sizeClasses[size],
        className
      )}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={`${name}'s Avatar`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="tracking-wide uppercase">{initials}</span>
      )}
    </div>
  );
}
