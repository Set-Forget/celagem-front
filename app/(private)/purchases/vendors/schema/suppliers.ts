import { z } from "zod";

export const newSupplierGeneralSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  email: z.string({ required_error: "El correo electrónico es requerido" }).email({ message: "El correo electrónico es inválido" }),
  website: z.string({ required_error: "El sitio web es requerido" }).min(1, { message: "El sitio web es requerido" }),
  contact_address_inline: z.string({ required_error: "La dirección de contacto es requerida" }),
})

export const newSupplierOthersSchema = z.object({
  tax_id: z.string({ required_error: "La identificación fiscal es requerida" }).min(1, { message: "La identificación fiscal es requerida" }), // * Listo
  commercial_company_name: z.string({ required_error: "El nombre registrado del proveedor es requerido" }).min(1, { message: "El nombre registrado del proveedor es requerido" }),
  property_payment_term: z.number({ required_error: "La condición de pago es requerida" }),
  property_account_position: z.union([z.string(), z.literal(false)]), // ? ¿Esto que es?
  currency: z.number(),
  phone: z.string().optional(),
  tax_type: z.string({ required_error: "El tipo de documento es requerido" }),
  economic_activity: z.string({ required_error: "La actividad económica es requerida" }),
  entity_type: z.string({ required_error: "El tipo de entidad es requerido" }),
  nationality_type: z.string({ required_error: "La nacionalidad es requerida" }),
  tax_regime: z.string({ required_error: "El régimen tributario es requerido" }),
  tax_category: z.string({ required_error: "El régimen fiscal es requerido" }),
  is_resident: z.boolean().default(true),
  tax_information: z.string({ required_error: "La información tributaria es requerida" }),
  fiscal_responsibility: z.string({ required_error: "La responsabilidad fiscal es requerida" }),
  payment_method: z.string({ required_error: "El medio de pago es requerido" }),

  accounting_account: z.number({ required_error: "La cuenta contable es requerida" }), // ! No existe en el schema.
  //withholdings: z.string(), // ! No existe en el schema (Retencion Sobre ICA, No Aplica Ret. Fuente, Retencion Sobre IVA).
})

export const newSupplierSchema = newSupplierGeneralSchema.merge(newSupplierOthersSchema)

export const supplierListSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  website: z.string(),
  contact_address_inline: z.string(),
  purchase_order_count: z.number(), // ? Esto creo que no es muy útil.
  tax_id: z.string(),
  status: z.boolean(),
})

export const supplierDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  website: z.string(),
  contact_address_inline: z.string(),
  purchase_order_count: z.number(), // ? Esto creo que no es muy útil.
  tax_id: z.string(),
  status: z.boolean(),
  payment_amount_due: z.number(),
  payment_amount_overdue: z.number(),
  total_invoiced: z.number(),
  property_payment_term: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  property_account_position: z.string().nullable(), // ? Esto no se bien que es.
  commercial_company_name: z.string(), // ? Esto no se bien que es.
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  phone: z.string(),
  internal_notes: z.string(), // ! Debería ser un array de notas.
  tags: z.array(z.string()),
  tax_type: z.string(), // @ U_HBT_TipDoc - Código del tipo de documento.
  entity_type: z.string(), // @ U_HBT_TipEnt - Código del tipo de entidad.
  nationality_type: z.string(), // @ U_HBT_Nacional - Código de la nacionalidad.
  tax_regime: z.string(), // @ U_HBT_RegTrib - Código del regimen tributario.
  tax_category: z.string(), // @ U_HBT_RegFis - Regimen Fiscal.
  is_resident: z.boolean(), // @ U_HBT_Residente - Residente.
  tax_information: z.string(), // @ U_HBT_InfoTrib - Información Tributaria.
  fiscal_responsibility: z.string(), // @ U_HBT_ResFis1 - Responsabilidad Fiscal.
  economic_activity: z.object({
    id: z.number(),
    name: z.string(),
  }), // @ U_HBT_ActEco - Código de la actividad económica.
  payment_method: z.object({
    id: z.number(),
    name: z.string(),
  }), // @ U_HBT_MedPag - Medio de Pago.
  traceability: z.object({
    created_by: z.string(),
    created_at: z.string(),
    updated_by: z.string(),
    updated_at: z.string(),
  }),

  // ! Falta accounting_account.
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