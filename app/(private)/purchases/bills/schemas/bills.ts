import { z } from "zod";

export const newBillLineSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  quantity: z.number(),
  taxes_id: z.array(z.number()).optional(),
});

export const newBillSchema = z.object({
  supplier: z.number({ required_error: "El proveedor es requerido" }),
  number: z.string({ required_error: "El número de factura es requerido" }),
  date: z.string({ required_error: "La fecha de factura es requerida" }),
  accounting_date: z.string({ required_error: "La fecha contable es requerida" }),
  currency: z.string({ required_error: "La moneda es requerida" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  purchase_order: z.number().optional(), // ! En el schema original es purchase_orders y es un array de number, pero no esta funcionando.
  accounting_account: z.string({ required_error: "La cuenta contable es requerida" }), // ! No existe en el schema original.
  cost_center: z.string().optional(), // ! No existe en el schema original.
  notes: z.string().optional(), // ! No existe en el schema original, debe camiarse de nombre a internal_notes.
  // ! Falta tyc_notes.
  payment_term: z.string({ required_error: "La condición de pago es requerida" }), // ! Debe ser un number, pero primero necesito tener el endpoint.
  payment_method: z.string({ required_error: "El método de pago es requerido" }).optional(), // ! Debe ser un number, pero primero necesito tener el endpoint.
  items: z.array(newBillLineSchema).min(1, { message: "Debe agregar al menos un item" }),
})

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
  status: z.enum(["posted", "draft"]),
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
  status: z.enum(["posted", "draft"]),
  date: z.string(),
  due_date: z.string(),
  accounting_date: z.string(),
  currency: z.string(),
  payment_term: z.string(),
  payment_method: z.string(),
  purchase_orders: z.array(z.number()),
  // ! Falta accounting_account.
  // ! Falta cost_center.
  // ! Falta internal_notes.
  // ! Falta tyc_notes.
  items: z.array(billLineSchema),
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
