import { z } from "zod";
import { supplierSchema } from "../../vendors/schema/suppliers";

export const newQuotationRequestSchema = z.object({
  suppliers: z.array(supplierSchema).nonempty("Al menos un proveedor es requerido"),
  notes: z.string().optional(),
  template: z.string({ required_error: "La plantilla es requerida" }),
});

