import { z } from "zod";

export const newInvoiceSchema = z.object({
  customer: z.string({ required_error: "El cliente es requerido" }),
  invoice_date: z.string({ required_error: "La fecha de emisión es requerida" }),
  due_date: z.string({ required_error: "La fecha de vencimiento es requerida" }),
  order_number: z.string().optional(),
  account: z.string({ required_error: "La cuenta es requerida" }),
  items: z
    .array(
      z.object({
        id: z.string(),
        description: z.string({ required_error: "La descripción es requerida" }),
        quantity: z.number({ required_error: "La cantidad es requerida" }).positive("Quantity must be greater than 0"),
        price: z.string({ required_error: "El precio es requerido" }),
        tax: z.enum(["0", "21", "10.5"]),
        item_code: z.string({ required_error: "El código es requerido" }),
        item_name: z.string({ required_error: "El nombre es requerido" }),
      })
    )
    .nonempty("At least one item is required"),
  currency: z.string({ required_error: "La moneda es requerida" }),
  payment_terms: z.string({ required_error: "Payment Term is required" }),
  notes: z.string().optional(),
  cost_center: z.string().optional(),
});

export type NewInvoice = z.infer<typeof newInvoiceSchema>;
