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

const fieldSchemaGenerators: Record<FieldType["type"], (field: Field) => ZodTypeAny> = {
  text: (field: Field) => {
    let schema = z.string();
    if (field.type.values && field.type.values.maxLength) {
      schema = schema.max(
        field.type.values.maxLength,
        { message: `El máximo permitido es ${field.type.values.maxLength} caracteres.` }
      );
    }
    return schema;
  },
  textarea: (field: Field) => {
    let schema = z.string();
    if (field.type.values && field.type.values.maxLength) {
      schema = schema.max(
        field.type.values.maxLength,
        { message: `El máximo permitido es ${field.type.values.maxLength} caracteres.` }
      );
    }
    return schema;
  },
  number: (field: Field) => {
    let schema = z.number();
    if (field.type.values && field.type.values.min !== undefined) {
      schema = schema.min(
        field.type.values.min,
        { message: `El valor mínimo es ${field.type.values.min}.` }
      );
    }
    if (field.type.values && field.type.values.max !== undefined) {
      schema = schema.max(
        field.type.values.max,
        { message: `El valor máximo es ${field.type.values.max}.` }
      );
    }
    return schema;
  },
  checkbox: (_field: Field) => z.boolean(),
  date: (_field: Field) =>
    z.string().refine(
      (val) => !isNaN(Date.parse(val)),
      { message: "Fecha inválida." }
    ),
  datetime: (_field: Field) =>
    z.string().refine(
      (val) => !isNaN(Date.parse(val)),
      { message: "Fecha y hora inválidas." }
    ),
  time: (_field: Field) => z.string(), // Se puede ampliar con validaciones específicas.
  email: (_field: Field) =>
    z.string().email({ message: "Dirección de correo inválida." }),
  file: (_field: Field) =>
    // Dependiendo de la implementación, se podría validar el tipo, tamaño, etc.
    z.instanceof(File),
  select: (_field: Field) =>
    // Si se dispone de opciones, se puede restringir el valor mediante z.enum o validaciones personalizadas.
    z.string(),
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
      { message: "Campo requerido." }
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
        case "date":
        case "datetime":
        case "time":
        case "select":
          defaultValue = properties?.defaultText ?? "";
          break;
        case "number":
          defaultValue = properties?.defaultText ? Number(properties.defaultText) : undefined;
          break;
        case "checkbox":
          if (properties?.defaultText !== undefined) {
            if (typeof properties.defaultText === "boolean") {
              defaultValue = properties.defaultText;
            } else if (typeof properties.defaultText === "string") {
              defaultValue = properties.defaultText.toLowerCase() === "true";
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

  console.log(defaultValues);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {section.fields.map((field: Field) => (
                    <div key={field.id} className="flex flex-col gap-1">
                      <RenderField field={field} control={form.control} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </form>
        </Form>
      </div>
    </>
  )
}
