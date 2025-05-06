import { z } from "zod";

export const newDebitNoteLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  quantity: z.number(),
  taxes_id: z.array(z.number()).optional(),

  unit_price: z.number(), // ! No existe en el backend.
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
  status: z.enum(["draft", "posted", "cancel"]),
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

export const newDebitNoteSchema = z.object({
  partner: z.number(),
  date: z.string({ required_error: "La fecha de emisión es requerida" }).nonempty({ message: "La fecha de emisión no puede estar vacía" }),
  number: z.string().optional(), // ! Debería autogenerarse, pero no lo hace.
  accounting_date: z.string({ required_error: "La fecha contable es requerida" }).nonempty({ message: "La fecha contable no puede estar vacía" }),
  currency: z.number(),
  payment_term: z.number({ required_error: "La condición de pago es requerida" }),
  payment_method: z.string().optional(), // ! No existe en el backend.
  move_type: z.string(),
  internal_notes: z.string().optional(),
  associated_invoice: z.number(),
  items: z.array(newDebitNoteLineSchema),
})

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