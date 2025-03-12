import { z } from "zod";

const accountsPayableListSchema = z.object({
  id: z.number(),
  date: z.string(),
  supplier: z.string(),
  accounting_account: z.string(),
  costs_center: z.string(),
  voucher_type: z.string(),
  voucher_number: z.string(),
  due_date: z.string(),
  invoiced_amount: z.number().nullable(),
  paid_amount: z.number().nullable(),
  outstanding_amount: z.number().nullable(),
  currency: z.string(),
  "30_days": z.number().nullable(),
  "60_days": z.number().nullable(),
  "90_days": z.number().nullable(),
  "120_days": z.number().nullable(),
  "120+_days": z.number().nullable(),
})

export type AccountsPayableList = z.infer<typeof accountsPayableListSchema>;