import { z } from "zod";

const propertiesSchema = z.object({
  maxLength: z.number().optional(),
  defaultValue: z.string().optional() || z.number().optional(),
  maxValue: z.number().optional(),
  minValue: z.number().optional(),
  decimalPlaces: z.number().optional(),
  isConditionalForNextStep: z.boolean().optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
}).nullable();

const fieldTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum([
    "textarea",
    "text",
    "number",
    "checkbox",
    "date",
    "datetime",
    "time",
    "email",
    "file",
    "select",
  ]),
  properties: propertiesSchema,
});

/**
 * TODO: Eliminar "primitiveFieldId" y "primitiveField"
*/
const typeSchema = z.object({
  id: z.number(),
  primitiveFieldId: z.number(),
  values: propertiesSchema,
  primitiveField: fieldTypeSchema,
});

/**
 * TODO: Cambiar "sectionTemplateFormMedicalRecordId" por "section_id"
*/
const fieldSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
  isRule: z.boolean(),
  isValidFormula: z.boolean(),
  formula: z.string(),
  rule: z.string(),
  isAlert: z.boolean(),
  isConditionalSection: z.boolean(),
  isConditionalField: z.boolean(),
  isVisible: z.boolean(),
  isEditable: z.boolean(),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  sectionTemplateFormMedicalRecordId: z.number(),
  type: typeSchema,
});

const sectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(["form", "table"]),
  description: z.string(),
  isActive: z.boolean(),
  isForPrintInColumns: z.boolean(),
  fields: z.array(fieldSchema),
});

export const templateSchema = z.object({
  id: z.number(),
  name: z.string(),
  layout: z.string(),
  type: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdBy: z.number(),
  createdAt: z.string().datetime(),
  updatedBy: z.number().nullable(),
  updatedAt: z.string().datetime(),
  isEpicrisis: z.boolean(),
  isForSendEmailToInsuranceProvider: z.boolean(),
  isForPrintIndependently: z.boolean(),
  isForPrintWithAllTheTemplates: z.boolean(),
  isForSendOrderToAppointmentBox: z.boolean(),
  sections: z.array(sectionSchema),
});

export type FieldType = z.infer<typeof fieldTypeSchema>;
export type Field = z.infer<typeof fieldSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Template = z.infer<typeof templateSchema>;