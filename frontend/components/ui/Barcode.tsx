"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  showText?: boolean;
  className?: string;
}

/**
 * High-performance, self-contained SVG Barcode renderer using classic 1D Code-39 encoding principles.
 * Guarantees zero complex library bindings, generating crisp, vector-scalable 1D mock/real barcodes.
 */
export default function Barcode({
  value,
  width = 240,
  height = 55,
  showText = true,
  className,
}: BarcodeProps) {
  // Simple, robust Code-39 alphabet bar sequence map (9 bars: 3 wide, 6 narrow)
  // '0' = narrow, '1' = wide.
  const code39Map: Record<string, string> = {
    "A": "100001001", "B": "001001001", "C": "101001000", "D": "000011001",
    "E": "100011000", "F": "001011000", "G": "000001101", "H": "100001100",
    "I": "001001100", "J": "000011100", "K": "100000011", "L": "001000011",
    "M": "101000010", "N": "000010011", "O": "100010010", "P": "001010010",
    "Q": "000000111", "R": "100000110", "S": "001000110", "T": "000010110",
    "U": "110000001", "V": "011000001", "W": "111000000", "X": "010010001",
    "Y": "110010000", "Z": "011010000", "0": "000110100", "1": "100100001",
    "2": "001100001", "3": "101100000", "4": "000110001", "5": "100110000",
    "6": "001110000", "7": "000100101", "8": "100100100", "9": "001100100",
    "-": "000100011", ".": "110000010", " ": "011000010", "*": "010010100",
  };

  const svgBars = useMemo(() => {
    // Format message inside Code-39 standard boundary start & stop frames "*"
    const cleanValue = `*${value.toUpperCase().replace(/[^A-Z0-9\-\.\s]/g, "")}*`;
    
    let pattern = "";
    for (let i = 0; i < cleanValue.length; i++) {
      const char = cleanValue[i];
      const bars = code39Map[char] || code39Map[" "]; // Fallback to space
      pattern += bars + "0"; // trailing space gap between symbols
    }

    // Convert bits structure into discrete SVG rect coordinates layout streams
    const rects: React.ReactNode[] = [];
    let currentX = 0;
    const narrowWidth = 1.6;
    const wideWidth = 3.6;

    for (let k = 0; k < pattern.length; k++) {
      const isWide = pattern[k] === "1";
      const w = isWide ? wideWidth : narrowWidth;
      const isBar = k % 2 === 0;

      if (isBar) {
        rects.push(
          <rect
            key={k}
            x={currentX}
            y={0}
            width={w}
            height={height}
            className="fill-slate-900 dark:fill-white"
          />
        );
      }
      currentX += w;
    }

    return { rects, totalWidth: currentX };
  }, [value, height]);

  return (
    <div className={cn("flex flex-col items-center select-none", className)}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${svgBars.totalWidth} ${height}`}
        preserveAspectRatio="none"
        className="max-w-xs"
      >
        <g>{svgBars.rects}</g>
      </svg>
      {showText && (
        <span className="text-[10px] font-mono tracking-[0.25em] text-slate-500 font-semibold uppercase mt-1">
          {value}
        </span>
      )}
    </div>
  );
}
