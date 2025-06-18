import { CalendarDate, CalendarDateTime, Time } from "@internationalized/date";
import { z } from "zod";
import { fieldTypes } from "../templates/utils";

type PrimitiveType = typeof fieldTypes[number]['value'];

const primitiveTypes = fieldTypes.map(f => f.value) as [PrimitiveType, ...PrimitiveType[]];

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

const primitiveTypeSchema = z.enum(primitiveTypes);

const baseTypeSchema = z.object({
  primitive_type: primitiveTypeSchema,
  properties: z.object({
    maxLength: z.preprocess(
      val => (val === null ? undefined : val),
      z.number({ invalid_type_error: 'Campo requerido', required_error: 'Campo requerido' }).optional()
    ),
    maxValue: z.preprocess(
      val => (val === null ? undefined : val),
      z.number({ invalid_type_error: 'Campo requerido', required_error: 'Campo requerido' }).optional()
    ),
    minValue: z.preprocess(
      val => (val === null ? undefined : val),
      z.number({ invalid_type_error: 'Campo requerido', required_error: 'Campo requerido' }).optional()
    ),
    decimalPlaces: z.preprocess(
      val => (val === null ? undefined : val),
      z.number({ invalid_type_error: 'Campo requerido', required_error: 'Campo requerido' }).optional()
    ),
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
    defaultValue: z.preprocess(
      val => (val === null ? undefined : val),
      z.number({
        invalid_type_error: 'Campo requerido',
        required_error: 'Campo requerido',
      }).optional()
    ),
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
    defaultValue: dateValueSchema.optional().nullable(),
  }),
});

const dateTimeSchema = baseTypeSchema.extend({
  primitive_type: z.literal("datetime"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: dateTimeValueSchema.optional().nullable(),
  }),
});

const timeSchema = baseTypeSchema.extend({
  primitive_type: z.literal("time"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: timeValueSchema.optional().nullable(),
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

const multiSelectSchema = baseTypeSchema.extend({
  primitive_type: z.literal("multiselect"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: z.array(z.string()).optional(),
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

const imcSchema = baseTypeSchema.extend({
  primitive_type: z.literal("imc"),
  properties: baseTypeSchema.shape.properties.extend({
    defaultValue: z.string().optional(),
  }),
});

export const typeSchema = z.preprocess((val) => {
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    if (typeof obj.primitive_type !== "string") return

    const newPrimitiveType = primitiveTypes.includes(obj.primitive_type as typeof primitiveTypes[number])
      ? (obj.primitive_type as typeof primitiveTypes[number])
      : "text";

    return {
      ...obj,
      primitive_type: newPrimitiveType,
      properties: obj.properties ?? {}
    };
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
  multiSelectSchema,
  titleSchema,
  imcSchema,
]));

const fieldSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
  is_rule: z.boolean(),
  is_valid_formula: z.boolean(),
  formula: z.string().nullable(),
  rule: z.string().nullable(),
  is_alert: z.boolean(),
  is_conditional_section: z.boolean(),
  is_conditional_field: z.boolean(),
  is_visible: z.boolean(),
  is_editable: z.boolean(),
  is_required: z.boolean(),
  is_active: z.boolean(),
  section_id: z.number(),
  type: typeSchema,
  order: z.number(),
});

export const newFieldSchema = z.object({
  id: z.number(),
  title: z
    .string({ required_error: "El título es requerido" })
    .trim()
    .min(1, { message: "El título es requerido" }),
  code: z.string(),
  is_rule: z.boolean(),
  is_valid_formula: z.boolean(),
  formula: z.string().nullable(),
  rule: z.string().nullable(),
  is_alert: z.boolean(),
  is_conditional_section: z.boolean(),
  is_conditional_field: z.boolean(),
  is_visible: z.boolean(),
  is_editable: z.boolean(),
  is_required: z.boolean(),
  is_active: z.boolean(),
  section_id: z.number(),
  type: typeSchema,
  order: z.number().optional(),
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
  is_active: z.boolean(),
  is_for_print_in_columns: z.boolean(),
  fields: z.array(z.number()),
});

export const importSectionSchema = z.object({
  id: z.number()
});

export const sectionDetailSchema = z.object({
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
  is_active: z.boolean(),
  is_for_print_in_columns: z.boolean(),
  fields: z.array(fieldSchema),
});

export const newTemplateSchema = z.object({
  id: z.number().optional(),
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  layout: z.string().optional(),
  type: z.string().optional(),
  description: z.preprocess((val) => (val == null ? "No hay descripción" : val), z.string({ required_error: "La descripción es requerida" }).min(1, { message: "La descripción es requerida" })),
  is_active: z.boolean(),
  is_epicrisis: z.boolean(),
  is_for_send_email_to_insurance_provider: z.boolean(),
  is_for_print_independently: z.boolean(),
  is_for_print_with_all_the_templates: z.boolean(),
  is_for_send_order_to_appointment_box: z.boolean(),
  sections: z.array(z.number()),
});

export const templateDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  layout: z.string(),
  type: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_by: z.string(),
  created_at: z.string().datetime(),
  updated_by: z.string().nullable(),
  updated_at: z.string().datetime().nullable(),
  is_epicrisis: z.boolean(),
  is_for_send_email_to_insurance_provider: z.boolean(),
  is_for_print_independently: z.boolean(),
  is_for_print_with_all_the_templates: z.boolean(),
  is_for_send_order_to_appointment_box: z.boolean(),
  sections: z.array(sectionDetailSchema),
});

export const templateListSchema = z.object({
  id: z.number(),
  name: z.string(),
  sections: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
})

export const sectionListSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(["form", "table"]),
  description: z.string(),
  created_at: z.string(),
})

export const sectionListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(sectionListSchema),
});

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
  data: newFieldSchema.omit({ is_rule: true, is_valid_formula: true, is_alert: true, is_conditional_section: true, is_conditional_field: true, is_visible: true, is_editable: true, is_required: true, is_active: true, id: true }).extend({ id: z.number() }),
});

export const newTemplateResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: newTemplateSchema
});

export const sectionDetailResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: sectionDetailSchema
});

export type FieldType = z.infer<typeof typeSchema>;
export type NewField = z.infer<typeof newFieldSchema>;
export type NewFieldResponse = z.infer<typeof newFieldResponseSchema>;
export type Field = z.infer<typeof fieldSchema>;

export type NewSection = z.infer<typeof newSectionSchema>;
export type NewSectionResponse = z.infer<typeof newSectionResponseSchema>;
export type Section = z.infer<typeof sectionDetailSchema>;

export type SectionList = z.infer<typeof sectionListSchema>;
export type SectionListResponse = z.infer<typeof sectionListResponseSchema>;
export type SectionDetailResponse = z.infer<typeof sectionDetailResponseSchema>;
export type SectionDetail = z.infer<typeof sectionDetailSchema>;

export type NewTemplate = z.infer<typeof newTemplateSchema>;
export type NewTemplateResponse = z.infer<typeof newTemplateResponseSchema>;
export type TemplateDetail = z.infer<typeof templateDetailSchema>;
export type TemplateDetailResponse = z.infer<typeof templateDetailResponseSchema>;

export type TemplateList = z.infer<typeof templateListSchema>;
export type TemplateListResponse = z.infer<typeof templateListResponseSchema>;