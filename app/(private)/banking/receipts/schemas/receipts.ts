import { billDetailSchema } from "@/app/(private)/purchases/bills/schemas/bills";
import { invoiceDetailSchema } from "@/app/(private)/sales/invoices/schemas/invoices";
import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const paymentListSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number(),
  state: z.string(),
  currency: z.string(),
  partner: z.string(),
  journal: z.string(),
  source_account: z.string()

  // ! Falta la fecha de pago.
  // ! Falta el metodo de pago.
})

export const paymentDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number(),
  date: z.string(),
  state: z.string(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  partner: z.object({
    id: z.number(),
    name: z.string(),
  }),
  journal: z.object({
    id: z.number(),
    name: z.string(),
  }),
  source_account: z.object({
    id: z.number(),
    name: z.string(),
  }),
  payment_method: z.object({
    id: z.number(),
    name: z.string(),
  }),
  payment_reference: z.string(), // ? No sé que es.
  invoices: z.array(z.object({
    id: z.number(),
    name: z.string(),
    amount_total: z.number(),
    payment_state: z.string(),
  })),
  credit_notes: z.array(z.object({
    id: z.number(),
    name: z.string(),
    amount_total: z.number(),
  })),
  debit_notes: z.array(z.object({
    id: z.number(),
    name: z.string(),
    amount_total: z.number(),
  })),
  reconciled_invoices: z.array(z.object({
    id: z.number(),
    name: z.string(),
    amount: z.number(),
  })),
  reconciled_bills: z.array(z.object({
    id: z.number(),
    name: z.string(),
    amount: z.number(),
  })),
  traceability: z.object({
    created_by: z.string(),
    created_at: z.string(),
    updated_by: z.string(),
    updated_at: z.string(),
  }),
})

export const newChargeSchema = z.object({
  amount: z.number().optional(),
  date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de pago es requerida" }),
  currency: z.number({ required_error: "La moneda es requerida" }), journal: z.number().optional(),
  partner: z.number().optional(),
  payment_method: z.number({ required_error: "El método de pago es requerido" }),
  payment_reference: z.string().optional(),
  invoices: z.array(z.number()).optional(),

  // ! Esto no existe
  bills: z.array(invoiceDetailSchema).optional(),
})

export const newChargeResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

export const paymentListResponseSchema = z.object({
  status: z.string(),
  data: z.array(paymentListSchema),
})

export const paymentDetailResponseSchema = z.object({
  status: z.string(),
  data: paymentDetailSchema,
})

export type ChargeList = z.infer<typeof paymentListSchema>;
export type ChargeListResponse = z.infer<typeof paymentListResponseSchema>;

export type ChargeDetail = z.infer<typeof paymentDetailSchema>;
export type ChargeDetailResponse = z.infer<typeof paymentDetailResponseSchema>;

export type NewCharge = z.infer<typeof newChargeSchema>;
export type NewChargeResponse = z.infer<typeof newChargeResponseSchema>;