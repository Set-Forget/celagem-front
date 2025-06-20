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

export const newPaymentTermSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  note: z.string().optional(),
  sequence: z.number({ required_error: "El número de secuencia es requerido" }).min(1, { message: "El número de secuencia es requerido" }).optional(),
  items: z.array(z.object({
    value: z.enum(['percent']).optional(),
    value_amount: z.number().optional(),
    nb_days: z.number({ required_error: "El número de días es requerido" }).min(1, { message: "El número de días es requerido" }),
    delay_type: z.enum(['days_after', 'days_after_end_of_month', 'days_after_end_of_next_month', 'days_end_of_month_on_the'], { required_error: "El tipo de retraso es requerido" }),
  })),
})

export const newPaymentTermResponseSchema = z.object({
  status: z.string(),
  data: paymentTermDetailsSchema,
})

export const paymentTermDetailsResponseSchema = z.object({
  status: z.string(),
  data: paymentTermDetailsSchema,
})

export type PaymentTermList = z.infer<typeof paymentTermListSchema>;
export type PaymentTermListResponse = z.infer<typeof paymentTermListResponseSchema>;

export type PaymentTermDetails = z.infer<typeof paymentTermDetailsSchema>;
export type PaymentTermDetailsResponse = z.infer<typeof paymentTermDetailsResponseSchema>;

export type NewPaymentTerm = z.infer<typeof newPaymentTermSchema>;
export type NewPaymentTermResponse = z.infer<typeof newPaymentTermResponseSchema>;