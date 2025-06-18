import { z } from "zod";

export const paymentMethodLinesListSchema = z.object({
  id: z.number(),
  payment_method: z.string(),
  company: z.string(),
  payment_account: z.string(),
  payment_type: z.enum(['inbound', 'outbound']),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
})

export const paymentMethodLineDetailSchema = z.object({
  id: z.number(),
  payment_type: z.enum(['inbound', 'outbound']),
  payment_method: z.object({
    id: z.number(),
    name: z.string(),
  }),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  payment_account: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
});

export const newPaymentMethodSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  code: z.string().optional(),
  payment_type: z.enum(['inbound', 'outbound'], { required_error: "El tipo de pago es requerido" }),
  company: z.number({ required_error: "La empresa es requerida" }).min(1, { message: "La empresa es requerida" }).optional(),
  payment_account: z.number({ required_error: "La cuenta de pago es requerida" }).min(1, { message: "La cuenta de pago es requerida" }),
})

export const paymentMethodDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  code: z.string(),
  payment_type: z.enum(['inbound', 'outbound']),
  lines: z.array(z.object({
    id: z.number(),
    company: z.number(),
    payment_account: z.number(),
  })),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
})

export const paymentMethodDetailResponseSchema = z.object({
  status: z.string(),
  data: paymentMethodDetailSchema,
})

export const newPaymentMethodResponseSchema = z.object({
  status: z.string(),
  data: paymentMethodLineDetailSchema,
})

export const paymentMethodLineDetailResponseSchema = z.object({
  status: z.string(),
  data: paymentMethodLineDetailSchema,
});

export const paymentMethodLineListResponseSchema = z.object({
  status: z.string(),
  data: z.array(paymentMethodLinesListSchema),
})

export type PaymentMethodLineList = z.infer<typeof paymentMethodLinesListSchema>;
export type PaymentMethodLineListResponse = z.infer<typeof paymentMethodLineListResponseSchema>;

export type PaymentMethodLineDetail = z.infer<typeof paymentMethodLineDetailSchema>;
export type PaymentMethodLineDetailResponse = z.infer<typeof paymentMethodLineDetailResponseSchema>;

export type PaymentMethodDetail = z.infer<typeof paymentMethodDetailSchema>;
export type PaymentMethodDetailResponse = z.infer<typeof paymentMethodDetailResponseSchema>;

export type NewPaymentMethod = z.infer<typeof newPaymentMethodSchema>;
export type NewPaymentMethodResponse = z.infer<typeof newPaymentMethodResponseSchema>;

