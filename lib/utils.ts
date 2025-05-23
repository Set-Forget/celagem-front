import { clsx, type ClassValue } from "clsx";
import { ReactNode } from "react";
import { FieldValues, Path, PathValue, UseFormResetField, UseFormSetValue } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export type Overwrite<T, U> = Omit<T, keyof U> & U;

export interface FieldDefinition<T> {
  label: string | ((row: T) => ReactNode);
  render: (row: T) => ReactNode;
  placeholder?: ReactNode;
  placeholderLength?: number;
  className?: string | ((row: T) => string | undefined);
  show?: (row: T) => boolean;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function round(n: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((n + Number.EPSILON) * factor) / factor;
};

export function placeholder(length: number, mayus: boolean = false): string {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  return mayus ? characters.slice(0, length).toUpperCase() : characters.slice(0, length)
}

export function createApply<T extends FieldValues>(
  setValue: UseFormSetValue<T>,
  resetField: UseFormResetField<T>
) {
  return function apply<K extends Path<T>>(
    key: K,
    value: PathValue<T, K> | null | undefined,
    shouldValidate = true
  ) {
    if (value != null) {
      setValue(key, value, { shouldValidate });
    } else {
      resetField(key);
    }
  };
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

export function toWords(input: number | string): string {
  let raw = String(input).trim();
  if (raw.includes('.') && raw.includes(',')) {
    if (raw.lastIndexOf('.') < raw.lastIndexOf(',')) {
      raw = raw.replace(/\./g, '').replace(',', '.');
    } else {
      raw = raw.replace(/,/g, '');
    }
  } else {
    raw = raw.replace(',', '.');
  }

  if (!/^-?\d+(\.\d+)?$/.test(raw)) {
    throw new Error('Invalid number format: ' + input);
  }

  const isNegative = raw.startsWith('-');
  const [integerPartStr, decimalPartStr = ''] = raw.replace(/^-/, '').split('.');
  const integerPartNum = parseInt(integerPartStr, 10);

  const UNITS = [
    'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
    'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete',
    'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés',
    'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'
  ];

  const TENS: Record<number, string> = {
    30: 'treinta', 40: 'cuarenta', 50: 'cincuenta',
    60: 'sesenta', 70: 'setenta', 80: 'ochenta', 90: 'noventa'
  };

  const HUNDREDS: Record<number, string> = {
    100: 'cien', 200: 'doscientos', 300: 'trescientos',
    400: 'cuatrocientos', 500: 'quinientos', 600: 'seiscientos',
    700: 'setecientos', 800: 'ochocientos', 900: 'novecientos'
  };

  function convertBelowThousand(n: number): string {
    if (n < 30) return UNITS[n];
    if (n < 100) {
      const ten = Math.floor(n / 10) * 10;
      const unit = n % 10;
      return unit === 0
        ? TENS[ten]
        : `${TENS[ten]} y ${UNITS[unit]}`;
    }
    if (n === 100) {
      return HUNDREDS[100];
    }
    const hundred = Math.floor(n / 100) * 100;
    const rest = n % 100;
    const hundredWord = hundred === 100 ? 'ciento' : HUNDREDS[hundred];
    return `${hundredWord} ${convertBelowThousand(rest)}`;
  }

  const SCALES = ['', 'mil', 'millón', 'mil millones', 'billón'];
  const PLURAL_SCALES = new Set([2, 4]);

  function convertInteger(n: number): string {
    if (n === 0) return 'cero';
    const parts: string[] = [];
    let idx = 0;
    while (n > 0) {
      const chunk = n % 1000;
      if (chunk !== 0) {
        let text = convertBelowThousand(chunk);
        if (idx > 0) {
          let scale = SCALES[idx]!;
          if (PLURAL_SCALES.has(idx)) {
            scale = chunk === 1 ? scale : scale + 'es';
          }
          text += scale ? ` ${scale}` : '';
        }
        parts.unshift(text);
      }
      n = Math.floor(n / 1000);
      idx++;
    }
    return parts.join(' ').trim();
  }

  let result = (isNegative ? 'menos ' : '') + convertInteger(integerPartNum);

  if (decimalPartStr) {
    const decimalNum = parseInt(decimalPartStr, 10);
    if (decimalNum > 0) {
      result += ' con ' + convertInteger(decimalNum);
    }
  }

  return result;
}