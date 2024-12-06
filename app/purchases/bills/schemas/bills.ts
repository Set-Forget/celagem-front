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
});

export type NewBill = z.infer<typeof newBillSchema>;
export type BillItem = z.infer<typeof billItemSchema>;
