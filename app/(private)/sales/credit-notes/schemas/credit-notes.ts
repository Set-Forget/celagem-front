import { z } from "zod";

export const newCreditNoteLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  quantity: z.number(),
  taxes_id: z.array(z.number()).optional(),

  unit_price: z.number(), // ! No existe en el backend.
});

export const creditNoteLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  price_unit: z.number(),
  price_subtotal: z.number(),
  price_tax: z.number(),
  taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
})

export const creditNoteDetailSchema = z.object({
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
  items: z.array(creditNoteLineSchema)
})

export const newCreditNoteSchema = z.object({
  partner: z.number(),
  date: z.string({ required_error: "La fecha de emisión es requerida" }).nonempty({ message: "La fecha de emisión no puede estar vacía" }),
  number: z.string().optional(), // ! Debería autogenerarse, pero no lo hace.
  accounting_date: z.string({ required_error: "La fecha contable es requerida" }).nonempty({ message: "La fecha contable no puede estar vacía" }),
  currency: z.number(),
  move_type: z.string(),
  internal_notes: z.string().optional(),
  associated_invoice: z.number(),
  items: z.array(newCreditNoteLineSchema),
})

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

export type CreditNoteDetail = z.infer<typeof creditNoteDetailSchema>;
export type CreditNoteDetailResponse = z.infer<typeof creditNoteDetailResponseSchema>;

export type CreditNoteItem = z.infer<typeof creditNoteLineSchema>;

export type NewCreditNote = z.infer<typeof newCreditNoteSchema>;
export type NewCreditNoteResponse = z.infer<typeof newCreditNoteResponseSchema>;