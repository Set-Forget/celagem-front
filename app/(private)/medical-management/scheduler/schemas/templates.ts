import { CalendarDate, CalendarDateTime, Time } from "@internationalized/date";
import { z } from "zod";

const dateValueSchema = z.preprocess((data) => {
  if (data instanceof CalendarDate) return data;
  if (data !== null && typeof data === "object") {
    const { year, month, day } = data as CalendarDate;
    return new CalendarDate(year, month, day);
  }
  return data;
}, z.custom<CalendarDate>(
  (data) => data instanceof CalendarDate,
  { message: "La fecha es invalida" }
)) as z.ZodType<CalendarDate>;

const timeValueSchema = z.preprocess((data) => {
  if (data instanceof Time) return data;
  if (data !== null && typeof data === "object") {
    const { hour, minute, second } = data as Time;
    return new Time(hour, minute, second);
  }
  return data;
}, z.custom<Time>(
  (data) => data instanceof Time,
  { message: "El tiempo es inválido" }
)) as z.ZodType<Time>;

const dateTimeValueSchema = z.preprocess((data) => {
  if (data instanceof CalendarDateTime) return data;
  if (data !== null && typeof data === "object") {
    const { year, month, day, hour, minute, second, millisecond } = data as CalendarDateTime;
    return new CalendarDateTime(year, month, day, hour, minute, second, millisecond);
  }
  return data;
}, z.custom<CalendarDateTime>(
  (data) => data instanceof CalendarDateTime,
  { message: "La fecha tiempo es invalida" }
)) as z.ZodType<CalendarDateTime>;


const fileSchema = z.instanceof(File);

const primitiveTypeSchema = z.enum([
  "textarea",
  "text",
  "number",
  "checkbox",
  "date",
  "datetime",
  "time",
  "file",
  "select",
  "title"
]);

const baseTypeSchema = z.object({
  primitive_type: primitiveTypeSchema,
  properties: z.object({
    maxLength: z.number().optional(),
    maxValue: z.number().optional(),
    minValue: z.number().optional(),
    decimalPlaces: z.number().optional(),
    isConditionalForNextStep: z.boolean().optional(),
    options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  }),
});

const textareaSchema = baseTypeSchema.extend({
  primitive_type: z.literal("textarea"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: z.string().optional(),
  }),
});

const textSchema = baseTypeSchema.extend({
  primitive_type: z.literal("text"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: z.string().optional(),
  }),
});

const numberSchema = baseTypeSchema.extend({
  primitive_type: z.literal("number"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: z.number().optional(),
  }),
});

const checkboxSchema = baseTypeSchema.extend({
  primitive_type: z.literal("checkbox"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: z.boolean().optional(),
  }),
});

const dateSchema = baseTypeSchema.extend({
  primitive_type: z.literal("date"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: dateValueSchema.optional(),
  }),
});

const dateTimeSchema = baseTypeSchema.extend({
  primitive_type: z.literal("datetime"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: dateTimeValueSchema.optional(),
  }),
});

const timeSchema = baseTypeSchema.extend({
  primitive_type: z.literal("time"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: timeValueSchema.optional(),
  }),
});

const fileSchemaSchema = baseTypeSchema.extend({
  primitive_type: z.literal("file"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: fileSchema.optional(),
  }),
});

const selectSchema = baseTypeSchema.extend({
  primitive_type: z.literal("select"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: z.string().optional(),
    options: z.array(z.object({ value: z.string(), label: z.string() })).nonempty({
      message: "Debe ingresar al menos una opción para este tipo de campo",
    }).default([{ value: "0", label: "Seleccione una opción" }]),
  })
});

const titleSchema = baseTypeSchema.extend({
  primitive_type: z.literal("title"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: z.string().optional(),
  }),
});

export const typeSchema = z.preprocess((val) => {
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    if (typeof obj.primitive_type === "string") {
      const allowed = [
        "textarea",
        "text",
        "number",
        "checkbox",
        "date",
        "datetime",
        "time",
        "file",
        "select",
        "title"
      ];
      const newPrimitiveType = allowed.includes(obj.primitive_type) ? obj.primitive_type : "text";
      return {
        ...obj,
        primitive_type: newPrimitiveType,
        properties: obj.properties ?? {}
      };
    }
  }
  return val;
}, z.discriminatedUnion("primitive_type", [
  textareaSchema,
  textSchema,
  numberSchema,
  checkboxSchema,
  dateSchema,
  dateTimeSchema,
  timeSchema,
  fileSchemaSchema,
  selectSchema,
  titleSchema,
]));

const fieldSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
  isRule: z.boolean(),
  isValidFormula: z.boolean(),
  formula: z.string().nullable(),
  rule: z.string().nullable(),
  isAlert: z.boolean(),
  isConditionalSection: z.boolean(),
  isConditionalField: z.boolean(),
  isVisible: z.boolean(),
  isEditable: z.boolean(),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  section_id: z.number(),
  type: typeSchema,
});

export const newFieldSchema = z.object({
  id: z.number(),
  title: z.string({ required_error: "El título es requerido" }).min(1, { message: "El título es requerido" }),
  code: z.string(),
  isRule: z.boolean(),
  isValidFormula: z.boolean(),
  formula: z.string().nullable(),
  rule: z.string().nullable(),
  isAlert: z.boolean(),
  isConditionalSection: z.boolean(),
  isConditionalField: z.boolean(),
  isVisible: z.boolean(),
  isEditable: z.boolean(),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  section_id: z.number(),
  type: typeSchema,
})

export const newSectionSchema = z.object({
  id: z.number(),
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  type: z.enum(["form", "table"]),
  description: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim() === "") {
        return "No hay descripción";
      }
      return val;
    },
    z.string({ required_error: "La descripción es requerida" }).min(1, { message: "La descripción es requerida" })
  ),
  isActive: z.boolean(),
  isForPrintInColumns: z.boolean(),
  fields: z.array(z.number()),
});

export const sectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.preprocess(
    (val) => {
      if (typeof val === "string") return val === "table" ? "table" : "form"
      return val;
    },
    z.enum(["form", "table"])
  ),
  description: z.string(),
  isActive: z.boolean(),
  isForPrintInColumns: z.boolean(),
  fields: z.array(fieldSchema),
});

export const newTemplateSchema = z.object({
  id: z.number().optional(),
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  layout: z.string().optional(),
  type: z.string().optional(),
  description: z.preprocess((val) => (val == null ? "No hay descripción" : val), z.string({ required_error: "La descripción es requerida" }).min(1, { message: "La descripción es requerida" })),
  isActive: z.boolean(),
  isEpicrisis: z.boolean(),
  isForSendEmailToInsuranceProvider: z.boolean(),
  isForPrintIndependently: z.boolean(),
  isForPrintWithAllTheTemplates: z.boolean(),
  isForSendOrderToAppointmentBox: z.boolean(),
  sections: z.array(z.number()),
});

export const templateDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  layout: z.string(),
  type: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdBy: z.string(),
  createdAt: z.string().datetime(),
  updatedBy: z.string().nullable(),
  updatedAt: z.string().datetime().nullable(),
  isEpicrisis: z.boolean(),
  isForSendEmailToInsuranceProvider: z.boolean(),
  isForPrintIndependently: z.boolean(),
  isForPrintWithAllTheTemplates: z.boolean(),
  isForSendOrderToAppointmentBox: z.boolean(),
  sections: z.array(sectionSchema),
});

export const templateListSchema = z.object({
  id: z.number(),
  name: z.string(),
  sections: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
})

export const templateListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(templateListSchema),
});

export const templateDetailResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: templateDetailSchema,
});

export const newSectionResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: newSectionSchema.omit({ fields: true }),
});

export const newFieldResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: newFieldSchema.omit({ isRule: true, isValidFormula: true, isAlert: true, isConditionalSection: true, isConditionalField: true, isVisible: true, isEditable: true, isRequired: true, isActive: true, id: true }).extend({ id: z.number() }),
});

export const newTemplateResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: newTemplateSchema
});

export type FieldType = z.infer<typeof typeSchema>;
export type NewField = z.infer<typeof newFieldSchema>;
export type NewFieldResponse = z.infer<typeof newFieldResponseSchema>;
export type Field = z.infer<typeof fieldSchema>;

export type NewSection = z.infer<typeof newSectionSchema>;
export type NewSectionResponse = z.infer<typeof newSectionResponseSchema>;
export type Section = z.infer<typeof sectionSchema>;

export type NewTemplate = z.infer<typeof newTemplateSchema>;
export type NewTemplateResponse = z.infer<typeof newTemplateResponseSchema>;
export type TemplateDetail = z.infer<typeof templateDetailSchema>;
export type TemplateDetailResponse = z.infer<typeof templateDetailResponseSchema>;

export type TemplateList = z.infer<typeof templateListSchema>;
export type TemplateListResponse = z.infer<typeof templateListResponseSchema>;