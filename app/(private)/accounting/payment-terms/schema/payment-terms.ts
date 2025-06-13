import { z } from "zod";

export const paymentTermListSchema = z.object({
  id: z.number(),
  name: z.string(),
  note: z.string(),
  active: z.boolean(),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
})

export const paymentTermListResponseSchema = z.object({
  status: z.string(),
  data: z.array(paymentTermListSchema),
})

export const paymentTermDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  note: z.string(),
  active: z.boolean(),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_at: z.string(),
  items: z.array(z.object({
    id: z.number(),
    value: z.number(),
    value_amount: z.number(),
    nb_days: z.number(),
    delay_type: z.enum(['days_after', 'days_after_end_of_month', 'days_after_end_of_next_month', 'days_end_of_month_on_the']),
  })),
})

export const paymentTermDetailsResponseSchema = z.object({
  status: z.string(),
  data: paymentTermDetailsSchema,
})

export type PaymentTermList = z.infer<typeof paymentTermListSchema>;
export type PaymentTermListResponse = z.infer<typeof paymentTermListResponseSchema>;

export type PaymentTermDetails = z.infer<typeof paymentTermDetailsSchema>;
export type PaymentTermDetailsResponse = z.infer<typeof paymentTermDetailsResponseSchema>;