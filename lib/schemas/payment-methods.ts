import { z } from "zod";

export const paymentMethodListSchema = z.object({
  id: z.number(),
  name: z.string(),
  note: z.string(),
  payment_type: z.enum(['inbound', 'outbound']),
})

export const paymentMethodDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  payment_type: z.enum(['inbound', 'outbound']),
});

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