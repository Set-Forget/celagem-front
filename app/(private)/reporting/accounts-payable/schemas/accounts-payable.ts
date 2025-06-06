import { z } from "zod";

const accountsPayableListSchema = z.object({
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
  voucher_type: z.enum(["in_credit_note", "out_credit_note", "in_debit_note", "out_debit_note", "in_invoice", "out_invoice", "general"]).nullable(),
  voucher_number: z.string().nullable(),
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

const accountsPayableListResponseSchema = z.object({
  status: z.string(),
  data: z.array(accountsPayableListSchema),
});

export type AccountsPayableList = z.infer<typeof accountsPayableListSchema>;
export type AccountsPayableListResponse = z.infer<typeof accountsPayableListResponseSchema>;