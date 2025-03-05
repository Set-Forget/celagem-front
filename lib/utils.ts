import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function placeholder(length: number, mayus: boolean = false): string {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  return mayus ? characters.slice(0, length).toUpperCase() : characters.slice(0, length)
}

export function formatDateToISO(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toISOString().split('T')[0];
}