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

export type CurrencyList = z.infer<typeof currencyListSchema>
export type CurrencyListResponse = z.infer<typeof currencyListResponseSchema>