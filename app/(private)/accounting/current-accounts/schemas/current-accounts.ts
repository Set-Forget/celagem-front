import { z } from "zod";

export const currentAccountsListSchema = z.object({
  id: z.number(),
  date: z.string(),
  partner: z.string(),
  account: z.string(),
  ref: z.string(),
  debit: z.number().nullable(),
  credit: z.number().nullable(),
  balance: z.number().nullable(),
  currency: z.string(),
})

export type CurrentAccountsList = z.infer<typeof currentAccountsListSchema>;
