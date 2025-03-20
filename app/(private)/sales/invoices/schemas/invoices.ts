import { z } from "zod";

export const newInvoiceLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  quantity: z.number(),
  taxes_id: z.array(z.number()).optional(),
});

export const newInvoiceSchema = z.object({
  customer: z.number({ required_error: "El cliente es requerido" }),
  number: z.string().optional(), // ! No debería ser requerido.
  date: z.string({ required_error: "La fecha de emisión es requerida" }).min(1, { message: "La fecha de emisión es requerida" }),
  accounting_date: z.string({ required_error: "La fecha contable es requerida" }).min(1, { message: "La fecha contable es requerida" }),
  currency: z.string({ required_error: "La moneda es requerida" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  payment_term: z.string({ required_error: "La condición de pago es requerida" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  items: z.array(newInvoiceLineSchema).min(1, { message: "Debe agregar al menos un item" }),

  accounting_account: z.string({ required_error: "La cuenta contable es requerida" }), // ! No existe en el schema original.
  cost_center: z.string().optional(), // ! No existe en el schema original.
  notes: z.string().optional(), // ! No existe en el schema original, debe camiarse de nombre a internal_notes.
  tyc_notes: z.string().optional(), // ! No existe en el schema original.
})

export const invoiceLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  price_unit: z.number(),
  price_subtotal: z.number(),
  // ! Falta price_tax.
  // ! Ellos muestran también la unidad de medida (tener en cuenta para el futuro).
  taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
})

export const invoiceListSchema = z.object({
  id: z.number(),
  number: z.string(),
  customer: z.string(),
  status: z.string(),
  date: z.string(),
  due_date: z.string(),
  amount_total: z.number(),
  currency: z.string(),
})

export const invoiceDetailSchema = z.object({
  id: z.number(), // ! No existe en el schema original
  number: z.string(),
  customer: z.string(), // ! Debería ser un objeto
  status: z.string(),
  date: z.string(),
  due_date: z.string(),
  accounting_date: z.string(),
  currency: z.string(),
  payment_term: z.string(),
  payment_method: z.string().nullable(),
  items: z.array(invoiceLineSchema),
})

export const invoiceListResponseSchema = z.object({
  status: z.string(),
  data: z.array(invoiceListSchema),
})

export const invoiceDetailResponseSchema = z.object({
  status: z.string(),
  data: invoiceDetailSchema,
})

export const newInvoiceResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

export type InvoiceList = z.infer<typeof invoiceListSchema>;
export type InvoiceListResponse = z.infer<typeof invoiceListResponseSchema>;

export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;
export type InvoiceDetailResponse = z.infer<typeof invoiceDetailResponseSchema>;

export type InvoiceItem = z.infer<typeof invoiceLineSchema>;

export type NewInvoice = z.infer<typeof newInvoiceSchema>;
export type NewInvoiceResponse = z.infer<typeof newInvoiceResponseSchema>;