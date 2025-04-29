import { DateValue, TimeValue } from "react-aria-components";
import { z, ZodObject, ZodTypeAny } from "zod";
import { Field, FieldType, Section, TemplateDetail } from "../../calendar/schemas/templates";

const isTimeValue = (value: unknown): value is TimeValue => {
  if (value === null) return true;
  return (
    typeof value === "object" &&
    value !== null &&
    "hour" in value &&
    typeof (value as any).hour === "number" &&
    "minute" in value &&
    typeof (value as any).minute === "number" &&
    "second" in value &&
    typeof (value as any).second === "number"
  );
};

const timeSchema = z.custom<TimeValue>(
  (val) => isTimeValue(val),
  { message: "Campo requerido" }
);

const dateSchema = z.custom<DateValue>(
  (val) => val as any,
  { message: "Campo requerido" }
);

const fieldSchemaGenerators: Record<FieldType["primitive_type"], (field: Field) => ZodTypeAny> = {
  text: (field: Field) => {
    let schema = z.string({ required_error: "Campo requerido" });
    if (field.type.properties && field.type.properties.maxLength) {
      schema = schema.max(
        field.type.properties.maxLength,
        { message: `El máximo permitido es ${field.type.properties.maxLength} caracteres` }
      );
    }
    return schema;
  },
  textarea: (field: Field) => {
    let schema = z.string();
    if (field.type.properties && field.type.properties.maxLength) {
      schema = schema.max(
        field.type.properties.maxLength,
        { message: `El máximo permitido es ${field.type.properties.maxLength} caracteres` }
      );
    }
    return schema;
  },
  number: (_field: Field) => {
    const schema = z.preprocess(
      (val) => (val === null ? undefined : val),
      z.number({ invalid_type_error: "Campo requerido", required_error: "Campo requerido" })
    );
    return schema;
  },
  checkbox: (_field: Field) => z.boolean(),
  date: (_field: Field) => dateSchema,
  datetime: (_field: Field) => dateSchema,
  time: (_field: Field) => timeSchema,
  file: (_field: Field) => z.instanceof(File, { message: "Campo requerido" }),
  select: (_field: Field) => z.string(),
  multiselect: (_field: Field) => z.array(z.string(), { message: "Campo requerido" }),
  title: (_field: Field) => z.string(),
  imc: (_field: Field) => z.object({
    height: z.number().optional(),
    weight: z.number().optional(),
    imc: z.string().optional(),
  })
};

export const generateFieldSchema = (field: Field): ZodTypeAny => {
  const primitiveType: FieldType["primitive_type"] = field.type.primitive_type;
  const generatorFn = fieldSchemaGenerators[primitiveType];
  if (!generatorFn) {
    throw new Error(`Tipo de campo no soportado: ${primitiveType}`);
  }
  let schema = generatorFn(field);

  if (field.is_required) {
    schema = schema.refine(
      (value) => value !== undefined && value !== null && value !== "",
      { message: "Campo requerido" }
    );
  } else {
    schema = schema.optional();
  }
  return schema;
}

export const generateFormSchema = (template: TemplateDetail): ZodObject<Record<string, ZodTypeAny>> => {
  const shape: Record<string, ZodTypeAny> = {};

  template.sections.forEach((section: Section) => {
    if (section.type === "table") {
      const rowShape: Record<string, ZodTypeAny> = {};
      section.fields.forEach((field: Field) => {
        rowShape[field.code] = generateFieldSchema(field);
      });
      shape[section.name] = z.array(z.object(rowShape));
    } else {
      section.fields.forEach((field: Field) => {
        shape[field.code] = generateFieldSchema(field);
      });
    }
  });

  return z.object(shape);
};

export const generateDefaultValues = (template: TemplateDetail): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};

  template.sections.forEach((section: Section) => {
    if (section.type === "table") {
      defaults[section.name] = [];
    } else {
      section.fields.forEach((field: Field) => {
        const props = field.type.properties;
        const t = field.type.primitive_type;
        let defaultValue: unknown;

        switch (t) {
          case "text":
          case "textarea":
          case "datetime":
          case "select":
            defaultValue = props?.defaultValue ?? "";
            break;
          case "number":
            defaultValue = props?.defaultValue !== undefined
              ? Number(props.defaultValue)
              : undefined;
            break;
          case "checkbox":
            if (props?.defaultValue !== undefined) {
              defaultValue = typeof props.defaultValue === "boolean"
                ? props.defaultValue
                : String(props.defaultValue).toLowerCase() === "true";
            } else {
              defaultValue = false;
            }
            break;
          case "file":
            defaultValue = undefined;
            break;
          case "imc":
            defaultValue = {
              height: undefined,
              weight: undefined,
              imc: undefined,
            }
            break;
          default:
            defaultValue = undefined;
        }

        defaults[field.code] = defaultValue;
      });
    }
  });

  return defaults;
};