'use client'

import Header from "@/components/header"
import RenderColumn from "@/app/medical-management/components/render-column"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import TEMPLATES from "@/lib/data/templates.json"
import { generateSchema, getDefaultValues } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Signature } from "lucide-react"
import { Fragment } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export type FieldType = "input" | "textarea" | "custom" | "number" | "select" | string

export interface FieldConfig {
  name: string;
  label?: string;
  type: FieldType;
  required?: boolean;
  requiredMessage?: string;
  placeholder?: string;
  className?: string;
  options?: { label: string; value: string, id?: string }[];
  tableColumns?: ColumnConfig[];
  component?: string;
  errorMessage?: string;
  minValue?: number;
  defaultValue?: any;
  readOnly?: boolean;
  dependsOn?: {
    field: string;
    filterOptions: {
      parentValue: string;
      options: { label: string; value: string }[];
    }[];
  };
}

export type ColumnConfig =
  | { rows: FieldConfig[] }
  | FieldConfig
  | {
    columns: ColumnConfig[]
  };

export interface SectionConfig {
  sectionName: string;
  columns: ColumnConfig[];
}

export interface FormConfig {
  id: number;
  formName: string;
  schema: string;
  sections: SectionConfig[];
}

export default function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const selectedTemplate = TEMPLATES.find((template) => template.id === 22)!
  const defaultValues = getDefaultValues(selectedTemplate.sections);

  const schema = generateSchema(selectedTemplate.sections);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log("Formulario enviado:", data);
  };

  console.log(form.formState.errors);

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
            <span className="text-base font-medium">{selectedTemplate.formName}</span>
            {selectedTemplate.sections.map((section, sectionIndex) => (
              <Fragment key={sectionIndex}>
                <div className="flex flex-col gap-4">
                  <fieldset className="border border-input rounded-md p-4 !shadow-sm">
                    {section.sectionName && <legend className="text-sm text-muted-foreground px-2">{section.sectionName}</legend>}
                    <div
                      className="grid gap-4"
                      style={{
                        gridTemplateColumns: `repeat(1, 1fr)`,
                      }}
                    >
                      {section.columns.map((column, columnIndex) =>
                        <Fragment key={columnIndex}>
                          <RenderColumn column={column} control={form.control} />
                        </Fragment>
                      )}
                    </div>
                  </fieldset>
                </div>
              </Fragment>
            ))}
          </form>
        </Form>
      </div>
    </>
  )
}
