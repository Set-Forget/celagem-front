import { z } from "zod";

export const currencyListSchema = z.object({
  id: z.number(),
  name: z.string(),
  symbol: z.string(),
  rate: z.number(),
  active: z.boolean(),
})

export const currencyListResponseSchema = z.object({
  status: z.string(),
  data: z.array(currencyListSchema),
})

export const currencyDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  symbol: z.string(),
  currency_unit_label: z.string(),
  currency_subunit_label: z.string(),
  rounding: z.number(),
  position: z.string(),
  rate: z.number(),
  active: z.boolean(),
  created_by: z.string(),
  created_at: z.string(),
})

export const currencyDetailResponseSchema = z.object({
  status: z.string(),
  data: currencyDetailSchema,
})

export const newCurrencySchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  symbol: z.string({ required_error: "El símbolo es requerido" }).min(1, { message: "El símbolo es requerido" }),
  currency_unit_label: z.string().optional(),
  currency_subunit_label: z.string().optional(),
  rounding: z.number().optional(),
  position: z.enum(['before', 'after']),

  rate: z.number({ required_error: "La tasa es requerida" }).min(0, { message: "La tasa debe ser mayor a 0" }),
})

export const newCurrencyResponseSchema = z.object({
  status: z.string(),
  data: currencyDetailSchema,
})

export type CurrencyList = z.infer<typeof currencyListSchema>
export type CurrencyListResponse = z.infer<typeof currencyListResponseSchema>

export type CurrencyDetail = z.infer<typeof currencyDetailSchema>
export type CurrencyDetailResponse = z.infer<typeof currencyDetailResponseSchema>

export type NewCurrency = z.infer<typeof newCurrencySchema>
export type NewCurrencyResponse = z.infer<typeof newCurrencyResponseSchema>