import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const newInvoiceLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  quantity: z.number(),
  taxes_id: z.array(z.number()).optional(),

  unit_price: z.number({ required_error: "El precio unitario es requerido" }), // ! No existe en el backend.
});

export const newInvoiceGeneralSchema = z.object({
  customer: z.number({ required_error: "El cliente es requerido" }),
  number: z.string().optional(),
  date: z.string({ required_error: "La fecha de factura es requerida" }),
  currency: z.number({ required_error: "La moneda es requerida" }),
  payment_term: z.number({ required_error: "La condición de pago es requerida" }),
  payment_method: z.string({ required_error: "El método de pago es requerido" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  tyc_notes: z.string().optional(),
  items: z.array(newInvoiceLineSchema).min(1, { message: "Debe agregar al menos un item" }),
})

export const newInvoiceOthersSchema = z.object({
  accounting_date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de contabilización es requerida" }),
  internal_notes: z.string().optional(),
  accounting_account: z.number({ required_error: "La cuenta contable es requerida" }).min(1, { message: "La cuenta contable es requerida" }), // ! No existe en el schema original.
  cost_center: z.number().optional(), // ! No existe en el schema original.
})

export const newInvoiceSchema = newInvoiceGeneralSchema.merge(newInvoiceOthersSchema)

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
  amount_total: z.number(), // ! Desapareció el amount_total en el schema original.
  type: z.enum(["invoice", "credit_note", "debit_note"]),
  currency: z.string(),
})

export const invoiceDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  customer: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.string(),
  }),
  status: z.enum(['draft', 'posted', 'cancel']),
  date: z.string(),
  due_date: z.string(),
  accounting_date: z.string(),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  payment_term: z.object({
    id: z.number(),
    name: z.string(),
  }),
  payment_method: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  internal_notes: z.string().optional(),
  tyc_notes: z.string().optional(),
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