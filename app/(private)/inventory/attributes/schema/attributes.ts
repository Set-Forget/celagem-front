import { z } from 'zod';

export const newAttributeGeneralSchema = z.object({
  sequence: z.number(),
  name: z.string(),
  display_type: z.string(),
  create_variant: z.string(),
  created_by: z.string(),
});

export const newAttributeSchema = newAttributeGeneralSchema

export const attributesSchema = z.object({
  id: z.number(),
  sequence: z.number(),
  name: z.string(),
  display_type: z.string(),
  create_variant: z.string(),
  created_at: z.string(),
  created_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  modified_at: z.string(),
  updated_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
});

export const attributesListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(attributesSchema),
});

export const attributeResponseSchema = z.object({
  // Create, Update, Get
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: attributesSchema,
});

export const attributeDeleteResponseSchema = z.object({
  // Delete
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const attributeCreateBodySchema = z.object({
  sequence: z.number(),
  name: z.string(),
  display_type: z.string(),
  create_variant: z.string(),
  created_by: z.string(),
});

export const attributeUpdateBodySchema = z.object({
  sequence: z.number(),
  name: z.string(),
  display_type: z.string(),
  create_variant: z.string(),
});

export type Attributes = z.infer<typeof attributesSchema>;
export type AttributesListResponse = z.infer<typeof attributesListResponseSchema>;
export type AttributeResponse = z.infer<typeof attributeResponseSchema>;
export type AttributeDeleteResponse = z.infer<
  typeof attributeDeleteResponseSchema
>;
export type AttributeCreateBody = z.infer<typeof attributeCreateBodySchema>;
export type AttributeUpdateBody = z.infer<typeof attributeUpdateBodySchema>;

export type NewAttribute = z.infer<typeof newAttributeSchema>;
