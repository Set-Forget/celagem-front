import { z } from "zod";

export const paymentTermListSchema = z.object({
  id: z.number(),
  name: z.string(),
  note: z.string(),
  active: z.boolean(),
})

export const paymentTermListResponseSchema = z.object({
  status: z.string(),
  data: z.array(paymentTermListSchema),
})

export type PaymentTermList = z.infer<typeof paymentTermListSchema>;
export type PaymentTermListResponse = z.infer<typeof paymentTermListResponseSchema>;