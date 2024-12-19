import { z } from "zod";

export const customerSchema = z.object({
  customer_id: z.string(),
  customer_name: z.string(),
  customer_type: z.string(),
  status: z.enum(["active", "inactive"]),
  contact_id: z.string(),
  contact_name: z.string(),
  contact_email: z.string(),
  id: z.string(),
  cuit: z.string(),
  address: z.string(),
  fiscal_category: z.string(),
});

export const newCustomerSchema = z.object({
  name: z.string(),
  phone_number: z.string(),
  email: z.string(),
  cuit: z.string(),
  city: z.string(),
  country: z.string(),
  province: z.string(),
  postal_code: z.string(),
  address: z.string(),
  tax_status: z.string(),
  registered_name: z.string(),
  fiscal_category: z.string(),
  customer_type: z.string(),
})

export type Customer = z.infer<typeof customerSchema>;
