import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const debitNoteStatus = z.enum(["draft", "posted", "cancel"]);
export const debitNoteMoveType = z.enum(["out_invoice", "in_invoice"]);

export const newDebitNoteLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  quantity: z.number(),
  taxes_id: z.array(z.number()).optional(),
  account_id: z.number({ required_error: "La cuenta contable es requerida" }),
  cost_center_id: z.number().optional(),
  price_unit: z.number(),
});

export const debitNoteLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  price_unit: z.number(),
  price_subtotal: z.number(),
  price_tax: z.number(),
  taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
})

export const debitNoteDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  partner: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.string(),
  }),
  status: debitNoteStatus,
  date: z.string(),
  due_date: z.string(),
  accounting_date: z.string(),
  currency: z.object({
    id: z.number(),
    name: z.string()
  }),
  payment_term: z.object({
    id: z.number(),
    name: z.string(),
  }),
  payment_method: z.object({
    id: z.number(),
    name: z.string(),
  }),
  internal_notes: z.string(),
  associated_invoice: z.object({
    id: z.number(),
    number: z.string(),
  }),
  items: z.array(debitNoteLineSchema)
})

export const newDebitNoteFiscalSchema = z.object({
  payment_term: z.number({ required_error: "La condición de pago es requerida" }),
  payment_method: z.number({ required_error: "El método de pago es requerido" }),
  currency: z.number(),
})

export const newDebitNoteNotesSchema = z.object({
  internal_notes: z.string().optional(),
  tyc_notes: z.string().optional(),
})

const newDebitNoteGeneralSchema = z
  .object({
    partner: z.number(),
    date: z
      .string({ required_error: 'La fecha de emisión es requerida' })
      .nonempty('La fecha de emisión no puede estar vacía'),
    number: z.string().optional(),
    accounting_date: z.custom<CalendarDate>(
      (data) => data instanceof CalendarDate,
      { message: 'La fecha de contabilización es requerida' }
    ),
    move_type: debitNoteMoveType,
    associated_invoice: z.number(),
    items: z.array(newDebitNoteLineSchema).min(1, { message: "Debe agregar al menos un item" }),
  })
  .merge(newDebitNoteFiscalSchema)
  .merge(newDebitNoteNotesSchema);

export const newDebitNoteSchema = newDebitNoteGeneralSchema.superRefine((data, ctx) => {
  if (data.move_type === 'in_invoice' && (!data.number || data.number.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['number'],
      message: 'El número es obligatorio para notas de débito entrantes',
    });
  }
});

export const debitNoteDetailResponseSchema = z.object({
  status: z.string(),
  data: debitNoteDetailSchema
});

export const newDebitNoteResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  })
});

export type DebitNoteDetail = z.infer<typeof debitNoteDetailSchema>;
export type DebitNoteDetailResponse = z.infer<typeof debitNoteDetailResponseSchema>;

export type DebitNoteItem = z.infer<typeof debitNoteLineSchema>;

export type NewDebitNote = z.infer<typeof newDebitNoteSchema>;
export type NewDebitNoteResponse = z.infer<typeof newDebitNoteResponseSchema>;