import { z } from "zod";

export const newCustomerGeneralSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  commercial_company_name: z.string().optional(),

  // ! Debe eliminarse.

  country_id: z.number().optional(),
  state_id: z.number().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  street: z.string().optional(),
})

export const newCustomerContactSchema = z.object({
  email: z.string({ required_error: "El correo electrónico es requerido" }).email({ message: "El correo electrónico es inválido" }),
  contact_address_inline: z.string({ required_error: "La dirección de contacto es requerida" }),
  website: z.string().optional(),
  phone: z.string().optional(),
})

export const newCustomerFiscalSchema = z.object({
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

export const newCustomerAccountingSchema = z.object({
  currency: z.number(),
  property_payment_term: z.number({ required_error: "La condición de pago es requerida" }),
  property_account_position: z.union([z.string(), z.literal(false)]), // ? ¿Esto que es?
  payment_method: z.number({ required_error: "El método de pago es requerido" }),
  account: z.number({ required_error: "La cuenta contable es requerida" }),
})

export const newCustomerSchema = newCustomerGeneralSchema
  .merge(newCustomerContactSchema)
  .merge(newCustomerFiscalSchema)
  .merge(newCustomerAccountingSchema)

export const newCustomerResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string()
  })
})

export const customerListSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  website: z.string(),
  contact_address_inline: z.string(),
  total_invoiced: z.number(),
  tax_id: z.string(),
  status: z.boolean(),
})

export const customerDetailSchema = z.object({
  // * General
  id: z.number(),
  name: z.string(),
  status: z.boolean(),
  tags: z.array(z.string()),
  commercial_company_name: z.string(),
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
  traceability: z.object({
    created_by: z.string(),
    created_at: z.string(),
    updated_by: z.string(),
    updated_at: z.string(),
  }),

  street: z.string(),
  city: z.string(),
  zip: z.string(),
  state_id: z.string(),
  country_id: z.string(),
})

export const customerListResponseSchema = z.object({
  status: z.string(),
  data: z.array(customerListSchema),
})

export const customerDetailResponseSchema = z.object({
  status: z.string(),
  data: customerDetailSchema,
})

export type NewCustomer = z.infer<typeof newCustomerSchema>;
export type NewCustomerResponse = z.infer<typeof newCustomerResponseSchema>;

export type CustomerList = z.infer<typeof customerListSchema>;
export type CustomerListResponse = z.infer<typeof customerListResponseSchema>;

export type CustomerDetail = z.infer<typeof customerDetailSchema>;
export type CustomerDetailResponse = z.infer<typeof customerDetailResponseSchema>;