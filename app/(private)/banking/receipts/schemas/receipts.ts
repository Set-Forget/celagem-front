import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { z } from "zod";

export const chargeState = z.enum(["draft", "in_process", "paid", "cancel"])

export const paymentListSchema = z.object({
  id: z.number(),
  sequence_id: z.string(),
  amount: z.number(),
  state: chargeState,
  currency: z.string(),
  partner: z.string(),
  journal: z.string(),
  source_account: z.string()

  // ! Falta la fecha de pago.
  // ! Falta el metodo de pago.
})

export const paymentDetailSchema = z.object({
  id: z.number(),
  sequence_id: z.string(),
  amount: z.number(),
  date: z.string(),
  state: chargeState,
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
  payment_reference: z.string(),
  journal_entry_lines: z.array(z.object({
    id: z.number(),
    name: z.string(),
    debit: z.number(),
    credit: z.number(),
    account: z.object({
      id: z.number(),
      name: z.string(),
    }),
    partner: z.object({
      id: z.number(),
      name: z.string(),
    }),
  })),
  invoices: z.array(z.object({
    sequence_id: z.string(),
    name: z.string(),
    amount_total: z.number(),
    payment_state: z.string(),
  })),
  credit_notes: z.array(z.object({
    sequence_id: z.number(),
    name: z.string(),
    amount_total: z.number(),
  })),
  debit_notes: z.array(z.object({
    sequence_id: z.number(),
    name: z.string(),
    amount_total: z.number(),
  })),
  reconciled_invoices: z.array(z.object({
    sequence_id: z.number(),
    name: z.string(),
    amount_total: z.number(),
  })),
  reconciled_bills: z.array(z.object({
    sequence_id: z.number(),
    name: z.string(),
    amount_total: z.number(),
  })),
  withholdings: z.array(z.object({
    tax: z.object({
      id: z.number(),
      name: z.string(),
    }),
    account: z.object({
      id: z.number(),
      name: z.string(),
    }),
  })),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
})

export const newChargeSchema = z.object({
  amount: z.number().optional(),
  date: z
    .custom<CalendarDate>((v) => v instanceof CalendarDate, {
      message: "La fecha de pago es requerida",
    })
    .refine(d => d.compare(today(getLocalTimeZone())) <= 0, {
      message: "La fecha de pago no puede ser posterior al día de hoy",
    }),
  currency: z.number({ required_error: "La moneda es requerida" }),
  journal: z.number().optional(),
  partner: z.number().optional(),
  payment_method: z.number({ required_error: "El método de pago es requerido" }),
  payment_reference: z.string().optional(),
  withholdings: z.array(z.number()).optional(),
  invoices: z.array(z.object({
    id: z.number(),
    number: z.union([z.string(), z.boolean()]),
    type: z.enum(["invoice", "credit_note", "debit_note"]),
    amount_residual: z.number(),
    currency: z.object({
      id: z.number(),
      name: z.string(),
    }),
    due_date: z.string(),
    customer: z.object({
      id: z.number(),
      name: z.string(),
    }),
  })).optional(),
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