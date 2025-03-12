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

//---

export const newSupplierSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }), // * Listo
  email: z.string({ required_error: "El correo electrónico es requerido" }).email({ message: "El correo electrónico es inválido" }), // ? Debería ser opcional.
  website: z.string({ required_error: "El sitio web es requerido" }).min(1, { message: "El sitio web es requerido" }), // ? Debería ser opcional.
  contact_address_inline: z.string({ required_error: "La dirección de contacto es requerida" }), // ? Debería ser opcional.
  tax_id: z.string({ required_error: "La identificación fiscal es requerida" }).min(1, { message: "La identificación fiscal es requerida" }), // * Listo
  commercial_company_name: z.string({ required_error: "El nombre registrado del proveedor es requerido" }).min(1, { message: "El nombre registrado del proveedor es requerido" }), // ? Debería ser opcional.
  property_payment_term: z.string({ required_error: "La condición de pago es requerida" }), // ? Debería ser opcional.
  property_account_position: z.union([z.string(), z.literal(false)]), // ? ¿Esto que es?
  vat: z.number().optional(), // ? ¿Esto que es?
  phone: z.string().optional(), // ! No existe en el schema.
  tax_regime: z.string().optional(), // ! No existe en el schema (U_HBT_RegTrib).
  tax_category: z.string().optional(), // ! No existe en el schema (U_HBT_RegFis).
  currency: z.string().optional(), // ! No existe en el schema.
  accounting_account: z.string().optional(), // ! No existe en el schema.
  tax_type: z.string({ required_error: "El tipo de documento es requerido" }), // ! No existe en el schema (U_HBT_TipDoc).
  economic_activity: z.string().optional(), // ! No existe en el schema (U_HBT_ActEco).
  entity_type: z.string().optional(), // ! No existe en el schema (U_HBT_TipEnt).
  nationality_type: z.string().optional(), // ! No existe en el schema (U_HBT_Nacional).
  payment_method: z.string().optional(), // ! No existe en el schema (U_HBT_MetPag).
  is_resident: z.boolean().default(false), // ! No existe en el schema (U_HBT_Residente).
  tax_information: z.string().optional(), // ! No existe en el schema (U_HBT_InfoTrib).
  fiscal_responsibility: z.string().optional(), // ! No existe en el schema (U_HBT_ResFis1).
  //withholdings: z.string(), // ! No existe en el schema (Retencion Sobre ICA, No Aplica Ret. Fuente, Retencion Sobre IVA).
})

export const supplierListSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  website: z.string(),
  contact_address_inline: z.string(),
  purchase_order_count: z.number(), // ? Esto creo que no es muy útil.
  tax_id: z.string(),
})

export const supplierDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  website: z.string(),
  contact_address_inline: z.string(),
  purchase_order_count: z.number(), // ? Esto creo que no es muy útil.
  tax_id: z.string(),
  payment_amount_due: z.number(),
  payment_amount_overdue: z.number(),
  total_invoiced: z.number(),
  property_payment_term: z.string(), // ? Esto no se bien que es.
  property_account_position: z.string().nullable(), // ? Esto no se bien que es.
  commercial_company_name: z.string(), // ? Esto no se bien que es.
  // ! Falta currency.
  // ! Falta el numero de telefono.
  // ! Falta la parte de trazabilidad (created_by/at, updated_by/at).
  // ! Falta la parte de notas (array de notas).
  // ! Falta la parte de tags (array de tags).
  // ! Falta accounting_account.
  // ! Falta tax_type o algo por el estilo para representar (U_HBT_RegTrib).
  // ! Falta economic_activity o algo por el estilo para representar (U_HBT_ActEco).
  // ! Falta entity_type o algo por el estilo para representar (U_HBT_TipEnt).
  // ! Falta nationality o algo por el estilo para representar (U_HBT_Nacional).
  // ! Falta tax_regime o algo por el estilo para representar (U_HBT_RegFis).
  // ! Falta payment_method o algo por el estilo para representar (U_HBT_MetPag).
  // ! Falta is_resident o algo por el estilo para representar (U_HBT_Residente).
  // ! Falta tax_information o algo por el estilo para representar (U_HBT_InfoTrib).
  // ! Falta fiscal_responsibility o algo por el estilo para representar (U_HBT_ResFis1).
  // ! Falta withholdings o algo por el estilo para representar (Retencion Sobre ICA, No Aplica Ret. Fuente, Retencion Sobre IVA).
})

export const supplierDetailResponseSchema = z.object({
  status: z.string(),
  data: supplierDetailSchema,
})

export const supplierListResponseSchema = z.object({
  status: z.string(),
  data: z.array(supplierListSchema),
})

export const newSupplierResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

export type NewSupplier = z.infer<typeof newSupplierSchema>;
export type NewSupplierResponse = z.infer<typeof newSupplierResponseSchema>;

export type SupplierList = z.infer<typeof supplierListSchema>;
export type SupplierListResponse = z.infer<typeof supplierListResponseSchema>;

export type SupplierDetail = z.infer<typeof supplierDetailSchema>;
export type SupplierDetailResponse = z.infer<typeof supplierDetailResponseSchema>;

export type Supplier = z.infer<typeof supplierSchema>;
