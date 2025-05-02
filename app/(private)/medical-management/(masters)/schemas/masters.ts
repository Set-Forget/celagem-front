import { z } from "zod"
import { newFieldSchema, newSectionSchema, newTemplateSchema } from "./templates"

export const sectionSchema = z.object({
  kind: z.literal('section'),
  section: newSectionSchema,
  fields: z.array(newFieldSchema)
})

export const templateSchema = z.object({
  kind: z.literal("template"),
  template: newTemplateSchema,
  sections: z.array(newSectionSchema),
  fields: z.array(newFieldSchema)
})

export const normalizedSchema = z.discriminatedUnion("kind", [
  sectionSchema,
  templateSchema,
]);

export type NormalizedSchema = z.infer<typeof normalizedSchema>;
export type TemplateSchema = z.infer<typeof templateSchema>
export type SectionSchema = z.infer<typeof sectionSchema>