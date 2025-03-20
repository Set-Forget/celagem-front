import { z } from "zod";

export const newDebitNoteLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  quantity: z.number(),
  taxes_id: z.array(z.number()).optional(),
});

export const debitNoteListSchema = z.object({
  id: z.number(),
  number: z.string(),
  partner: z.string(),
  status: z.string(),
  date: z.string(),
  due_date: z.string(),
  amount_total: z.number(),
  currency: z.string(),
  move_type: z.string(), // ? Esto es lo que diferencia una nota de crédito de una nota de débito.
})

export const debitNoteLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  price_unit: z.number(),
  price_subtotal: z.number(),
  // ! Falta price_tax.
  taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
})

export const debitNoteDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  partner: z.string(),
  status: z.string(),
  date: z.string(),
  due_date: z.string(), // ! No existe en la respuesta.
  accounting_date: z.string(), // ! No existe en la respuesta.
  currency: z.string(),
  payment_term: z.string(), // ! No existe en la respuesta.
  payment_method: z.string(), // ! No existe en la respuesta.
  move_type: z.string(),
  // ! Falta related_docs.
  related_invoice: z.object({
    id: z.number(),
    number: z.string(),
  }), // ! No existe en la respuesta.
  items: z.array(debitNoteLineSchema), // ! No existe en la respuesta.
})

export const newDebitNoteSchema = z.object({
  partner: z.number(),
  number: z.string(),
  date: z.string({ required_error: "La fecha de emisión es requerida" }).nonempty({ message: "La fecha de emisión no puede estar vacía" }),
  accounting_date: z.string({ required_error: "La fecha contable es requerida" }).nonempty({ message: "La fecha contable no puede estar vacía" }),
  currency: z.number(),
  payment_term: z.string({ required_error: "La condición de pago es requerida" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  move_type: z.string(),
  related_invoice: z.number(),
  items: z.array(newDebitNoteLineSchema),
})

export const debitNotesListResponseSchema = z.object({
  status: z.string(),
  data: z.array(debitNoteListSchema)
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

export type DebitNotesList = z.infer<typeof debitNoteListSchema>;
export type DebitNotesListResponse = z.infer<typeof debitNotesListResponseSchema>;

export type DebitNoteDetail = z.infer<typeof debitNoteDetailSchema>;
export type DebitNoteDetailResponse = z.infer<typeof debitNoteDetailResponseSchema>;

export type DebitNoteItem = z.infer<typeof debitNoteLineSchema>;

export type NewDebitNote = z.infer<typeof newDebitNoteSchema>;
export type NewDebitNoteResponse = z.infer<typeof newDebitNoteResponseSchema>;