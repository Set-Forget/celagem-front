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
    amount: z.number(),
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

export const newPaymentSchema = z.object({
  amount: z.number({ required_error: "El monto es requerido" }),
  date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de pago es requerida" }),
  currency: z.number({ required_error: "La moneda es requerida" }),
  journal: z.number({ required_error: "El diario contable es requerido" }),
  partner: z.number({ required_error: "El proveedor es requerido" }),
  payment_method: z.number({ required_error: "El método de pago es requerido" }),
  payment_reference: z.string({ required_error: "La referencia de pago es requerida" }),
  name: z.string({ required_error: "El nombre es requerido" }),
  invoice_ids: z.array(z.number()).optional(),

  // ! Esto no existe
  invoices: z.array(z.object({
    invoice_id: z.number({ required_error: "La factura es requerida" }),
    amount: z.number({ required_error: "El monto es requerido" }).min(1, { message: "El monto es requerido" }),
    withholding_ids: z.array(z.number()).optional(),
  })).optional(),
})

export const paymentListResponseSchema = z.object({
  status: z.string(),
  data: z.array(paymentListSchema),
})

export const paymentDetailResponseSchema = z.object({
  status: z.string(),
  data: paymentDetailSchema,
})

export type PaymentList = z.infer<typeof paymentListSchema>;
export type PaymentListResponse = z.infer<typeof paymentListResponseSchema>;

export type PaymentDetail = z.infer<typeof paymentDetailSchema>;
export type PaymentDetailResponse = z.infer<typeof paymentDetailResponseSchema>;