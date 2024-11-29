import { z } from "zod";

export const customerSchema = z.object({
  company_name: z.string(),
  type: z.enum(["natural_person", "company"]),
  cuit: z.string(),
  address: z.string(),
});

export const contactSchema = z.object({
  name: z.string(),
  last_name: z.string(),
  role: z.string(),
  email: z.string(),
  phone_number: z.string(),
});


export type Customer = z.infer<typeof customerSchema>;
export type Contact = z.infer<typeof contactSchema>;