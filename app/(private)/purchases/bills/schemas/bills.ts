import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const newBillLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  quantity: z.number(),
  purchase_line_id: z.number().optional(),
  taxes_id: z.array(z.number()).optional(),

  unit_price: z.string({ required_error: "El precio unitario es requerido" }), // ! No existe en el backend.
});

export const newBillGeneralSchema = z.object({
  supplier: z.number({ required_error: "El proveedor es requerido" }),
  number: z.string({ required_error: "El número de factura es requerido" }).min(1, { message: "El número de factura es requerido" }),
  date: z.string({ required_error: "La fecha de factura es requerida" }),
  currency: z.string({ required_error: "La moneda es requerida" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  payment_term: z.string({ required_error: "La condición de pago es requerida" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  payment_method: z.string({ required_error: "El método de pago es requerido" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  tyc_notes: z.string().optional(),
  items: z.array(newBillLineSchema).min(1, { message: "Debe agregar al menos un item" }),
})

export const newBillOthersSchema = z.object({
  accounting_date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de contabilización es requerida" }),
  internal_notes: z.string().optional(),
  accounting_account: z.string({ required_error: "La cuenta contable es requerida" }).min(1, { message: "La cuenta contable es requerida" }), // ! No existe en el schema original.
  cost_center: z.string().optional(), // ! No existe en el schema original.
})

export const newBillSchema = newBillGeneralSchema.merge(newBillOthersSchema);

export const newBillResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

export const billLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  price_unit: z.number(),
  price_subtotal: z.number(),
  price_tax: z.number(),
  taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
})

export const billListSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.string(),
  status: z.enum(['draft', 'posted', 'cancel']),
  date: z.string(),
  due_date: z.string(),
  amount_total: z.number(),
  currency: z.string(),
})

export const billDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  supplier: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string(),
  }),
  status: z.enum(['draft', 'posted', 'cancel']), // ! Falta el estado de aprobación.
  date: z.string(),
  due_date: z.string(),
  accounting_date: z.string(),
  currency: z.string(),
  payment_term: z.string(),
  payment_method: z.string(),
  purchase_orders: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
  internal_notes: z.string(),
  tyc_notes: z.string(),
  items: z.array(billLineSchema),

  // ! Falta accounting_account.
  // ! Falta cost_center.
})

export const billListResponseSchema = z.object({
  status: z.string(),
  data: z.array(billListSchema),
});

export const billDetailResponseSchema = z.object({
  status: z.string(),
  data: billDetailSchema,
});

export type NewBillLine = z.infer<typeof newBillLineSchema>;

export type NewBill = z.infer<typeof newBillSchema>;
export type NewBillResponse = z.infer<typeof newBillResponseSchema>;

export type BillList = z.infer<typeof billListSchema>;
export type BillListResponse = z.infer<typeof billListResponseSchema>;

export type BillDetail = z.infer<typeof billDetailSchema>;
export type BillItem = z.infer<typeof billLineSchema>;
export type BillDetailResponse = z.infer<typeof billDetailResponseSchema>;
