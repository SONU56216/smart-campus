"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QRCodeProps {
  value: string;
  size?: number;
  logoUrl?: string;
  className?: string;
}

export default function QRCode({ value, size = 180, logoUrl, className }: QRCodeProps) {
  return (
    <div className={cn("inline-flex items-center justify-center p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm select-none", className)}>
      <QRCodeSVG
        value={value}
        size={size}
        level="H" // High error correction, enabling university logo insertions
        includeMargin={false}
        imageSettings={
          logoUrl
            ? {
                src: logoUrl,
                x: undefined,
                y: undefined,
                height: Math.floor(size * 0.22),
                width: Math.floor(size * 0.22),
                excavate: true, // clears grid blocks behind the logo image
              }
            : undefined
        }
      />
    </div>
  );
}
