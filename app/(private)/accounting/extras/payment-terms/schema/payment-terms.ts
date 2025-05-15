import { z } from 'zod';

export const newPaymentTermGeneralSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre es requerido' })
    .default(''),
  note: z.string(),
  active: z.boolean(),
  created_by: z.string(),
});

export const newPaymentTermSchema = newPaymentTermGeneralSchema;

export const paymentTermsSchema = z.object({
  id: z.string(),
  name: z.string(),
  note: z.string(),
  active: z.boolean(),
  created_at: z.string().optional(),
  created_by: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
    })
    .optional(),
  modified_at: z.string().optional(),
  updated_by: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
    })
    .optional(),
});

export const paymentTermsListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(paymentTermsSchema),
});

export const paymentTermResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: paymentTermsSchema,
});

export const paymentTermDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const paymentTermCreateBodySchema = z.object({
  name: z.string(),
  created_by: z.string(),
});

export const paymentTermUpdateBodySchema = z.object({
  name: z.string(),
});

export type PaymentTerms = z.infer<typeof paymentTermsSchema>;
export type PaymentTermsListResponse = z.infer<typeof paymentTermsListResponseSchema>;
export type PaymentTermResponse = z.infer<typeof paymentTermResponseSchema>;
export type PaymentTermDeleteResponse = z.infer<typeof paymentTermDeleteResponseSchema>;
export type PaymentTermCreateBody = z.infer<typeof paymentTermCreateBodySchema>;
export type PaymentTermUpdateBody = z.infer<typeof paymentTermUpdateBodySchema>;

export type NewPaymentTerm = z.infer<typeof newPaymentTermSchema>;
