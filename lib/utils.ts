import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export type Overwrite<T, U> = Omit<T, keyof U> & U;

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

export function getFieldPaths(schema: z.ZodTypeAny, parentPath = ""): string[] {
  if (schema instanceof z.ZodObject) {
    const shape = schema._def.shape();
    const myPaths = parentPath ? [parentPath] : [];

    for (const key of Object.keys(shape)) {
      const subSchema = shape[key];
      const childPath = parentPath ? `${parentPath}.${key}` : key;
      const childPaths = getFieldPaths(subSchema, childPath);
      myPaths.push(...childPaths);
    }
    return myPaths;
  }

  return [parentPath];
}