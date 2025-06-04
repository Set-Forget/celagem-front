import { z } from "zod";

export const newSupplierGeneralSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  legal_name: z.string({ required_error: "El nombre registrado del proveedor es requerido" }).min(1, { message: "El nombre registrado del proveedor es requerido" }),

  // ! Debe eliminarse.

  country_id: z.number().optional(),
  state_id: z.number().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  street: z.string().optional(),
})

export const newSupplierContactSchema = z.object({
  email: z.string({ required_error: "El correo electrónico es requerido" }).email({ message: "El correo electrónico es inválido" }),
  contact_address_inline: z.string({ required_error: "La dirección de contacto es requerida" }),
  website: z.string({ required_error: "El sitio web es requerido" }).min(1, { message: "El sitio web es requerido" }),
  phone: z.string().optional(),
})

export const newSupplierFiscalSchema = z.object({
  tax_id: z.string({ required_error: "La identificación fiscal es requerida" }).min(1, { message: "La identificación fiscal es requerida" }),
  tax_type: z.string({ required_error: "El tipo de documento es requerido" }),
  economic_activity: z.number({ required_error: "La actividad económica es requerida" }),
  entity_type: z.string({ required_error: "El tipo de entidad es requerido" }),
  nationality_type: z.string({ required_error: "La nacionalidad es requerida" }),
  tax_regime: z.string({ required_error: "El régimen tributario es requerido" }),
  tax_category: z.string({ required_error: "El régimen fiscal es requerido" }),
  is_resident: z.boolean().default(true),
  tax_information: z.string({ required_error: "La información tributaria es requerida" }),
  fiscal_responsibility: z.string({ required_error: "La responsabilidad fiscal es requerida" }),
})

export const newSupplierAccountingSchema = z.object({
  currency: z.number(),
  property_payment_term: z.number({ required_error: "La condición de pago es requerida" }),
  property_account_position: z.union([z.string(), z.literal(false)]).optional(), // ? ¿Esto que es?
  payment_method: z.number({ required_error: "El método de pago es requerido" }),
  account: z.number({ required_error: "La cuenta contable es requerida" }),
})

export const newSupplierSchema = newSupplierGeneralSchema
  .merge(newSupplierContactSchema)
  .merge(newSupplierFiscalSchema)
  .merge(newSupplierAccountingSchema)

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
  // * General
  id: z.number(),
  name: z.string(),
  status: z.boolean(),
  tags: z.array(z.string()),
  legal_name: z.string(),
  payment_amount_due: z.number(),
  payment_amount_overdue: z.number(),
  total_invoiced: z.number(),

  // * Fiscal
  tax_id: z.string(),
  tax_type: z.string(), // @ U_HBT_TipDoc - Código del tipo de documento.
  fiscal_responsibility: z.string(), // @ U_HBT_ResFis1 - Responsabilidad Fiscal.
  entity_type: z.string(), // @ U_HBT_TipEnt - Código del tipo de entidad.
  nationality_type: z.string(), // @ U_HBT_Nacional - Código de la nacionalidad.
  tax_regime: z.string(), // @ U_HBT_RegTrib - Código del regimen tributario.
  tax_category: z.string(), // @ U_HBT_RegFis - Regimen Fiscal.
  is_resident: z.boolean(), // @ U_HBT_Residente - Residente.
  tax_information: z.string(), // @ U_HBT_InfoTrib - Información Tributaria.
  economic_activity: z.object({
    id: z.number(),
    name: z.string(),
  }), // @ U_HBT_ActEco - Código de la actividad económica.

  // * Contacto
  contact_address_inline: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),

  // * Pagos
  property_payment_term: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  payment_method: z.object({
    id: z.number(),
    name: z.string(),
  }), // @ U_HBT_MedPag - Medio de Pago.

  // * Contabilidad
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  property_account_position: z.string().nullable(), // ? Esto no se bien que es.
  account: z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
  }),

  // * Trazabilidad
  internal_notes: z.string(),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),

  street: z.string(),
  city: z.string(),
  zip: z.string(),
  state_id: z.number(),
  country_id: z.number(),

  purchase_order_count: z.number(), // ? Esto creo que no es muy útil.
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