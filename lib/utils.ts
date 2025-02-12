import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function placeholder(length: number, mayus: boolean = false): string {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  return mayus ? characters.slice(0, length).toUpperCase() : characters.slice(0, length)
}

