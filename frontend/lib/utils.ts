import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { COLOR_MAP } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null, pattern: string = "MMM dd, yyyy") {
  if (!dateString) return "N/A";
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    return format(date, pattern);
  } catch (error) {
    return "Invalid Date";
  }
}

export function formatDateTime(dateString?: string | null, pattern: string = "MMM dd, yyyy hh:mm a") {
  return formatDate(dateString, pattern);
}

export function formatCurrency(amount: number = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getStatusColor(status?: string | null): { bg: string; badge: string } {
  if (!status) return { bg: "bg-slate-50 text-slate-700 border-slate-200", badge: "bg-slate-400" };
  const upperStatus = status.toUpperCase();
  return (COLOR_MAP as any)[upperStatus] || { bg: "bg-slate-50 text-slate-700 border-slate-200", badge: "bg-slate-400" };
}

export function truncate(text?: string | null, maxLength: number = 30) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function generateInitials(fullName?: string | null) {
  if (!fullName) return "ST";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * Checks if a string is a valid JSON.
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
