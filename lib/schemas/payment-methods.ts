import { z } from "zod";

export const paymentMethodListSchema = z.object({
  id: z.number(),
  name: z.string(),
  note: z.string(),
  payment_type: z.enum(['inbound', 'outbound']),
})

export const paymentMethodListResponseSchema = z.object({
  status: z.string(),
  data: z.array(paymentMethodListSchema),
})

export type PaymentMethodList = z.infer<typeof paymentMethodListSchema>;
export type PaymentMethodListResponse = z.infer<typeof paymentMethodListResponseSchema>;