import { z } from "zod";

export const newCreditNoteLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  quantity: z.number(),
  taxes_id: z.array(z.number()).optional(),
});

export const creditNoteListSchema = z.object({
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

export const creditNoteLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  price_unit: z.number(),
  price_subtotal: z.number(),
  // ! Falta price_tax.
  taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
})

export const creditNoteDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  partner: z.string(),
  status: z.string(),
  date: z.string(),
  due_date: z.string(),
  accounting_date: z.string(),
  currency: z.string(),
  payment_term: z.string(),
  payment_method: z.string(),
  move_type: z.string(),
  // ! Falta related_docs.
  related_invoice: z.object({
    id: z.number(),
    number: z.string(),
  }), // ! No existe en la respuesta.
  items: z.array(creditNoteLineSchema),
})

export const newCreditNoteSchema = z.object({
  partner: z.number(),
  number: z.string(),
  date: z.string({ required_error: "La fecha de emisión es requerida" }).nonempty({ message: "La fecha de emisión no puede estar vacía" }),
  accounting_date: z.string({ required_error: "La fecha contable es requerida" }).nonempty({ message: "La fecha contable no puede estar vacía" }),
  currency: z.number(),
  payment_term: z.string({ required_error: "La condición de pago es requerida" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  move_type: z.string(),
  related_invoice: z.number(),
  items: z.array(newCreditNoteLineSchema),
})

export const creditNotesListResponseSchema = z.object({
  status: z.string(),
  data: z.array(creditNoteListSchema)
});

export const creditNoteDetailResponseSchema = z.object({
  status: z.string(),
  data: creditNoteDetailSchema
});

export const newCreditNoteResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  })
});

export type CreditNotesList = z.infer<typeof creditNoteListSchema>;
export type CreditNotesListResponse = z.infer<typeof creditNotesListResponseSchema>;

export type CreditNoteDetail = z.infer<typeof creditNoteDetailSchema>;
export type CreditNoteDetailResponse = z.infer<typeof creditNoteDetailResponseSchema>;

export type CreditNoteItem = z.infer<typeof creditNoteLineSchema>;

export type NewCreditNote = z.infer<typeof newCreditNoteSchema>;
export type NewCreditNoteResponse = z.infer<typeof newCreditNoteResponseSchema>;