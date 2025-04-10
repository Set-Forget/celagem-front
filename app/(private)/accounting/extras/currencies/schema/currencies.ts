import { z } from 'zod';

export const newCurrencyGeneralSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre es requerido' })
    .default(''),
  symbol: z.string(),
  rate: z.number(),
  active: z.boolean(),
  created_by: z.string(),
});

export const newCurrencySchema = newCurrencyGeneralSchema;

export const currenciesSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  rate: z.number(),
  active: z.boolean(),
  created_at: z.string().optional(),
  created_by: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
    })
    .optional(),
  modified_at: z.string().optional(),
  updated_by: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
    })
    .optional(),
});

export const currenciesListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(currenciesSchema),
});

export const currencyResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: currenciesSchema,
});

export const currencyDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const currencyCreateBodySchema = z.object({
  name: z.string(),
  created_by: z.string(),
});

export const currencyUpdateBodySchema = z.object({
  name: z.string(),
});

export type Currencies = z.infer<typeof currenciesSchema>;
export type CurrenciesListResponse = z.infer<typeof currenciesListResponseSchema>;
export type CurrencyResponse = z.infer<typeof currencyResponseSchema>;
export type CurrencyDeleteResponse = z.infer<typeof currencyDeleteResponseSchema>;
export type CurrencyCreateBody = z.infer<typeof currencyCreateBodySchema>;
export type CurrencyUpdateBody = z.infer<typeof currencyUpdateBodySchema>;

export type NewCurrency = z.infer<typeof newCurrencySchema>;
