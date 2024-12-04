
import { z } from "zod";

export const supplierSchema = z.object({
  supplier_id: z.string(),
  supplier_name: z.string(),
  supplier_type: z.string(),
  status: z.enum(["active", "inactive"]),
  contact_id: z.string(),
  contact_name: z.string(),
  contact_email: z.string(),
  id: z.string(),
  cuit: z.string(),
  address: z.string(),
});

export type Supplier = z.infer<typeof supplierSchema>;
