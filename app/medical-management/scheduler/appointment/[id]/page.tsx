'use client'

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Save, Signature } from "lucide-react"
import { useParams } from "next/navigation"
import { z, ZodObject, ZodTypeAny } from "zod"
import { Field, FieldType, Section, Template, templateSchema } from "../../schemas/templates"
import template from "@/lib/data/templates-v2.json"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import RenderField from "@/app/medical-management/components/render-field"
import { TimeValue, DateValue } from "react-aria-components"

const isTimeValue = (value: unknown): value is TimeValue => {
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

const fieldSchemaGenerators: Record<FieldType["type"], (field: Field) => ZodTypeAny> = {
  text: (field: Field) => {
    let schema = z.string();
    if (field.type.values && field.type.values.maxLength) {
      schema = schema.max(
        field.type.values.maxLength,
        { message: `El máximo permitido es ${field.type.values.maxLength} caracteres` }
      );
    }
    return schema;
  },
  textarea: (field: Field) => {
    let schema = z.string();
    if (field.type.values && field.type.values.maxLength) {
      schema = schema.max(
        field.type.values.maxLength,
        { message: `El máximo permitido es ${field.type.values.maxLength} caracteres` }
      );
    }
    return schema;
  },
  number: (_field: Field) => {
    let schema = z.preprocess(
      (val) => (val === null ? undefined : val),
      z.number({ invalid_type_error: "Campo requerido", required_error: "Campo requerido" })
    );
    return schema;
  },
  checkbox: (_field: Field) => z.boolean(),
  date: (_field: Field) => dateSchema,
  datetime: (_field: Field) => dateSchema,
  time: (_field: Field) => timeSchema,
  email: (_field: Field) => z.string().email({ message: "Dirección de correo inválida" }),
  file: (_field: Field) => z.instanceof(File, { message: "Campo requerido" }),
  select: (_field: Field) => z.string(),
};

const generateFieldSchema = (field: Field): ZodTypeAny => {
  const primitiveType: FieldType["type"] = field.type.primitiveField.type;
  const generatorFn = fieldSchemaGenerators[primitiveType];
  if (!generatorFn) {
    throw new Error(`Tipo de campo no soportado: ${primitiveType}`);
  }
  let schema = generatorFn(field);

  if (field.isRequired) {
    schema = schema.refine(
      (value) => value !== undefined && value !== null && value !== "",
      { message: "Campo requerido" }
    );
  } else {
    schema = schema.optional();
  }
  return schema;
}

const generateFormSchema = (template: Template): ZodObject<Record<string, ZodTypeAny>> => {
  const shape: Record<string, ZodTypeAny> = {};

  template.sections.forEach((section: Section) => {
    section.fields.forEach((field: Field) => {
      shape[field.code] = generateFieldSchema(field);
    });
  });

  return z.object(shape);
}

const generateDefaultValues = (template: Template): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  template.sections.forEach((section: Section) => {
    section.fields.forEach((field: Field) => {
      const properties = field.type.values;
      const fieldType = field.type.primitiveField.type;
      let defaultValue: unknown = undefined;

      switch (fieldType) {
      case "text":
      case "textarea":
      case "email":
      case "datetime":
      case "select":
        defaultValue = properties?.defaultValue ?? "";
        break;
      case "number":
        defaultValue = properties?.defaultValue ? Number(properties.defaultValue) : undefined;
        break;
      case "checkbox":
        if (properties?.defaultValue !== undefined) {
          if (typeof properties.defaultValue === "boolean") {
            defaultValue = properties.defaultValue;
          } else if (typeof properties.defaultValue === "string") {
            defaultValue = properties.defaultValue.toLowerCase() === "true";
          } else {
            defaultValue = false;
          }
        } else {
          defaultValue = false;
        }
        break;
      case "file":
        defaultValue = null;
        break;
      default:
        defaultValue = undefined;
      }
      defaults[field.code] = defaultValue;
    });
  });
  return defaults;
}

export default function AppointmentPage() {
  const params = useParams<{ id: string }>();

  const id = params.id;

  const parsedTemplate = templateSchema.parse(template);

  const formSchema = generateFormSchema(parsedTemplate);
  const defaultValues = generateDefaultValues(parsedTemplate);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  console.log(form.formState.errors);
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Formulario enviado:", data);
  };

  return (
    <>
      <Header title="Visita N° 123456">
        <div className="flex gap-2 items-center ml-auto">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            variant="ghost"
            size="sm"
          >
            <Save />
            Guardar
          </Button>
          <Button size="sm">
            <Signature />
            Firmar visita
          </Button>
        </div>
      </Header>
      <div className="flex flex-col gap-4 py-4">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Datos de la visita</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Profesional</label>
              <span className="text-sm">Jhon Doe</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Tipo de atención</label>
              <span className="text-sm">Ovo-Aportante</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Modalidad</label>
              <span className="text-sm">Presencial</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Datos del paciente</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Nombre</label>
              <span className="text-sm">Juan Pérez</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Documento</label>
              <span className="text-sm">CC 123456789</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Tipo de vinculación</label>
              <span className="text-sm">Particular</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Sexo biologico</label>
              <span className="text-sm">Másculino</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Identidad de género</label>
              <span className="text-sm">Cisgénero</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Número de teléfono</label>
              <span className="text-sm">+54 9 11 1234 5678</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Email</label>
              <span className="text-sm">set@forget.com</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Ciudad de residencia</label>
              <span className="text-sm">Buenos Aires</span>
            </div>
          </div>
        </div>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 px-4"
          >
            <span className="text-base font-medium">{parsedTemplate.name}</span>
            {parsedTemplate.sections.map((section: Section) => (
              <div key={section.id} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <fieldset className="border border-input rounded-md p-4 !shadow-sm min-w-0 w-full flex flex-col gap-4">
                    {section.name && <legend className="text-sm text-muted-foreground px-2">{section.name}</legend>}
                    {section.fields.map((field: Field) => (
                      <div key={field.id} className="flex flex-col gap-2">
                        <RenderField field={field} control={form.control} />
                      </div>
                    ))}
                  </fieldset>
                </div>
              </div>
            ))}
          </form>
        </Form>
      </div>
    </>
  )
}
/* 

{selectedTemplate.sections.map((section, sectionIndex) => (
              <Fragment key={sectionIndex}>
                <div className="flex flex-col gap-4">
                  <fieldset className="border border-input rounded-md p-4 !shadow-sm min-w-0 w-full">
                    {section.sectionName && <legend className="text-sm text-muted-foreground px-2">{section.sectionName}</legend>}
                    <div
                      className="grid gap-4 w-full min-w-0"
                      style={{
                        gridTemplateColumns: `repeat(1, 1fr)`,
                      }}
                    >
                      {section.columns.map((column, columnIndex) =>
                        <div key={columnIndex} className="min-w-0 w-full">
                          <RenderColumn column={column} control={form.control} />
                        </div>
                      )}
                    </div>
                  </fieldset>
                </div>
              </Fragment>
            ))}
*/