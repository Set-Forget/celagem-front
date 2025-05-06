import { z } from "zod";

export const newCustomerGeneralSchema = z.object({
  phone: z.string().optional(),
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  email: z.string({ required_error: "El correo electrónico es requerido" }).email({ message: "El correo electrónico es inválido" }),
  contact_address_inline: z.string({ required_error: "La dirección de contacto es requerida" }),
  website: z.string().optional(),
  internal_notes: z.array(z.string()),
  tags: z.array(z.object({
    id: z.string(),
    text: z.string(),
  }))
})

export const newCustomerFiscalSchema = z.object({
  commercial_company_name: z.string().optional(),
  tax_type: z.string({ required_error: "El tipo de documento es requerido" }),
  tax_id: z.string({ required_error: "La identificación fiscal es requerida" }).min(1, { message: "La identificación fiscal es requerida" }),
  tax_regime: z.string().optional(),
  tax_category: z.string().optional(),
  tax_information: z.string().optional(),
  fiscal_responsibility: z.string().optional(),
  economic_activity: z.string().optional(),
  entity_type: z.string().optional(),
  nationality_type: z.string().optional(),
  is_resident: z.boolean().default(true),
})

export const newCustomerAccountingSchema = z.object({
  property_payment_term: z.number({ required_error: "El plazo de pago es requerido" }), // ! Debería ser opcional.
  property_account_position: z.union([z.string(), z.literal(false)]),
  currency: z.number({ required_error: "La moneda es requerida" }), // ! Debería ser opcional.
  payment_method: z.string().optional(),
  accounting_account: z.number().optional(), // ! No existe en el schema.
})

export const newCustomerSchema = newCustomerGeneralSchema
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
  id: z.number(),
  name: z.string(),
  email: z.string(),
  website: z.string(), // ! No debería mostrarse en clientes.
  contact_address_inline: z.string(),
  purchase_order_count: z.number(),
  tax_id: z.string(),
  payment_amount_due: z.number(),
  payment_amount_overdue: z.number(),
  total_invoiced: z.number(),
  property_payment_term: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  property_account_position: z.string().nullable(),
  commercial_company_name: z.string(),
  status: z.boolean(),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  phone: z.string(),
  internal_notes: z.array(z.string()),
  tags: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })),
  tax_regime: z.string(), // @ U_HBT_RegTrib - Código del regimen tributario.
  tax_type: z.string(), // @ U_HBT_TipDoc - Código del tipo de documento.
  economic_activity: z.object({
    id: z.number(),
    name: z.string(),
  }), // @ U_HBT_ActEco - Código de la actividad económica.
  entity_type: z.string(), // @ U_HBT_TipEnt - Código del tipo de entidad.
  nationality_type: z.string(), // @ U_HBT_Nacional - Código de la nacionalidad.
  tax_category: z.string(), // @ U_HBT_RegFis - Regimen Fiscal.
  payment_method: z.object({
    id: z.number(),
    name: z.string(),
  }), // @ U_HBT_MedPag - Medio de Pago.
  is_resident: z.boolean(), // @ U_HBT_Residente - Residente.
  tax_information: z.string(), // @ U_HBT_InfoTrib - Información Tributaria.
  fiscal_responsibility: z.string(), // @ U_HBT_ResFis1 - Responsabilidad Fiscal.
  traceability: z.object({
    created_by: z.string(),
    created_at: z.string(),
    updated_by: z.string(),
    updated_at: z.string(),
  }),
  // ! Falta accounting_account.
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