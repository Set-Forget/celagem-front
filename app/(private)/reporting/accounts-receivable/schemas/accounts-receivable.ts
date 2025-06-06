import { z } from "zod";

const accountsReceivableListSchema = z.object({
  id: z.number(),
  date: z.string(),
  partner: z.object({
    id: z.number(),
    name: z.string(),
  }),
  accounting_account: z.object({
    id: z.number(),
    name: z.string(),
  }),
  costs_center: z.object({
    id: z.number(),
    name: z.string(),
  }),
  voucher_type: z.string(),
  voucher_number: z.string(),
  due_date: z.string(),
  invoiced_amount: z.number().nullable(),
  paid_amount: z.number().nullable(),
  outstanding_amount: z.number().nullable(),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  "30_days": z.number().nullable(),
  "60_days": z.number().nullable(),
  "90_days": z.number().nullable(),
  "120_days": z.number().nullable(),
  "120+_days": z.number().nullable(),
})

const accountsReceivableListResponseSchema = z.object({
  status: z.string(),
  data: z.array(accountsReceivableListSchema),
});

export type AccountsReceivableList = z.infer<typeof accountsReceivableListSchema>;
export type AccountsReceivableListResponse = z.infer<typeof accountsReceivableListResponseSchema>;