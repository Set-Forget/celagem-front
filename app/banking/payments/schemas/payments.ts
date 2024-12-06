import { z } from "zod";

export const newPaymentSchema = z.object({
  payment_type: z.enum(["pay", "receive", "transfer"]),
  payment_mode: z.enum(["cash", "check", "credit_card", "debit_card", "bank_transfer"]),
  payment_date: z.string(),
  party_type: z.enum(["customer", "supplier"]),
  party: z.object({
    id: z.string(),
    name: z.string(),
    balance: z.number(),
  }),
  company_bank_account: z.object({
    id: z.string(),
    name: z.string(),
  }),
  party_bank_account: z.object({
    id: z.string(),
    name: z.string(),
  }),
  party_contact: z.object({
    id: z.string(),
    name: z.string(),
  }),
  account: z.object({
    id: z.string(),
    name: z.string(),
  }),
  account_paid_from: z.object({
    id: z.string(),
    name: z.string(),
  }),
  account_paid_to: z.object({
    id: z.string(),
    name: z.string(),
  }),
  amount: z.number(),
  currency: z.string(),
  invoice_reference: z.string(),
  purchase_order_reference: z.string(),
  transaction_id: z.string(),
  cost_center: z.object({
    id: z.string(),
    name: z.string(),
  }),
})

export type NewPayment = z.infer<typeof newPaymentSchema>