import { z } from "zod";

export const billItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  item_code: z.string(),
  item_name: z.string(),
  quantity: z.number(),
  price: z.string(),
  tax: z.enum(["0", "21", "10.5"]),
});

export const newBillSchema = z.object({
  invoice_number: z.string({ required_error: "El número de factura es requerido" }),
  account: z.string({ required_error: "La cuenta contable es requerida" }),
  cost_center: z.string({ required_error: "El centro de costos es requerido" }),
  accounting_date: z.string({ required_error: "La fecha contable es requerida" }),
  purchase_order: z.string().optional(),
  supplier: z.string({ required_error: "El cliente es requerido" }),
  invoice_date: z.string({ required_error: "La fecha de emisión es requerida" }),
  due_date: z.string({ required_error: "La fecha de vencimiento es requerida" }),
  order_number: z.string().optional(),
  items: z.array(billItemSchema).nonempty("At least one item is required"),
  currency: z.string({ required_error: "La moneda es requerida" }),
  payment_term: z.string({ required_error: "Payment Term is required" }),
  notes: z.string().optional(),
  headquarter: z.object({
    id: z.string(),
    name: z.string(),
  }),
  payment_terms: z.string(),
});

//---

export const billLineSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  price_unit: z.number(),
  price_subtotal: z.number(),
  taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
  currency: z.string(),
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
  number: z.string(),
  supplier: z.string(),
  status: z.enum(["posted", "draft"]),
  date: z.string(),
  due_date: z.string(),
  accounting_date: z.string(),
  currency: z.string(),
  payment_term: z.string(),
  payment_method: z.string(),
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

export type NewBill = z.infer<typeof newBillSchema>;

export type BillList = z.infer<typeof billListSchema>;
export type BillListResponse = z.infer<typeof billListResponseSchema>;

export type BillDetail = z.infer<typeof billDetailSchema>;
export type BillItem = z.infer<typeof billLineSchema>;
export type BillDetailResponse = z.infer<typeof billDetailResponseSchema>;
