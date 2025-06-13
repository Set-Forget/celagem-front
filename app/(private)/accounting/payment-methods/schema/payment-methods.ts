import { z } from "zod";

export const paymentMethodListSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  code: z.string(),
  note: z.string(),
  payment_type: z.enum(['inbound', 'outbound']),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
})

export const paymentMethodDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  code: z.string(),
  note: z.string(),
  payment_type: z.enum(['inbound', 'outbound']),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const newPaymentMethodSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  code: z.string().optional(),
  payment_type: z.enum(['inbound', 'outbound'], { required_error: "El tipo de pago es requerido" }),
})

export const newPaymentMethodResponseSchema = z.object({
  status: z.string(),
  data: paymentMethodDetailSchema,
})

export const paymentMethodDetailResponseSchema = z.object({
  status: z.string(),
  data: paymentMethodDetailSchema,
});

export const paymentMethodListResponseSchema = z.object({
  status: z.string(),
  data: z.array(paymentMethodListSchema),
})

export type PaymentMethodList = z.infer<typeof paymentMethodListSchema>;
export type PaymentMethodListResponse = z.infer<typeof paymentMethodListResponseSchema>;

export type PaymentMethodDetail = z.infer<typeof paymentMethodDetailSchema>;
export type PaymentMethodDetailResponse = z.infer<typeof paymentMethodDetailResponseSchema>;

export type NewPaymentMethod = z.infer<typeof newPaymentMethodSchema>;
export type NewPaymentMethodResponse = z.infer<typeof newPaymentMethodResponseSchema>;