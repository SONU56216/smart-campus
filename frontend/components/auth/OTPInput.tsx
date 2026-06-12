"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  className,
  disabled = false,
}: OTPInputProps) {
  const [internalOtp, setInternalOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync internal array list representation if parent resets value parameter from outside
  useEffect(() => {
    const cleanVal = value.slice(0, length).padEnd(length, "").split("");
    setInternalOtp(cleanVal);
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value;
    if (disabled || !/^[0-9]?$/.test(val)) return;

    const newOtp = [...internalOtp];
    newOtp[idx] = val;
    setInternalOtp(newOtp);

    const merged = newOtp.join("");
    onChange(merged);

    // Dynamic focus forward
    if (val && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (disabled) return;

    // Shift focus backward on backspaces deletes
    if (e.key === "Backspace") {
      if (!internalOtp[idx] && idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        const newOtp = [...internalOtp];
        newOtp[idx - 1] = "";
        setInternalOtp(newOtp);
        onChange(newOtp.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedStr = e.clipboardData.getData("text/plain").trim().slice(0, length);
    if (!/^\d+$/.test(pastedStr)) return;

    const cleanVal = pastedStr.padEnd(length, "").split("");
    setInternalOtp(cleanVal);
    onChange(pastedStr);

    // Push cursor focus position to the very last segment box filled
    const lastFilledIdx = Math.min(pastedStr.length, length - 1);
    inputRefs.current[lastFilledIdx]?.focus();
  };

  return (
    <div className={cn("flex items-center justify-between gap-2.5 max-w-sm mx-auto", className)}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { inputRefs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={internalOtp[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 text-center text-xl font-bold border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-zinc-150 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary disabled:opacity-50 select-text"
        />
      ))}
    </div>
  );
}
