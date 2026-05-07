import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits
  }).format(value);
}

export function formatCurrency(value: number) {
  if (value >= 1_000_000) {
    return `${formatNumber(value / 1_000_000, 1)} ลบ.`;
  }
  return `${formatNumber(value, 0)} บาท`;
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}
