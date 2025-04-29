import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
import { z, ZodObject, ZodTypeAny } from "zod";
import { Field, Section, SectionDetail } from "../../../../calendar/schemas/templates";
import RenderField from "../../../../components/render-field";
import { resolveFieldDisplayValue } from "../../[visit_id]/components/template-view";
import { generateFieldSchema } from "../../utils";

interface TableSectionProps {
  section: Section;
}

const generateFormSchema = (section: SectionDetail): ZodObject<Record<string, ZodTypeAny>> => {
  const shape: Record<string, ZodTypeAny> = {};
  section.fields.forEach((field: Field) => {
    shape[field.code] = generateFieldSchema(field);
  });
  return z.object(shape);
};

const generateDefaultValues = (section: SectionDetail): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};

  section.fields.forEach((field: Field) => {
    const props = field.type.properties;
    const t = field.type.primitive_type;
    let defaultValue: unknown;

    switch (t) {
      case "text":
      case "textarea":
        defaultValue = props?.defaultValue ?? "";
        break;
      case "date":
      case "datetime":
      case "time":
        defaultValue = props?.defaultValue ?? null;
        break;
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
      default:
        defaultValue = undefined;
    }

    defaults[field.code] = defaultValue;
  });

  return defaults;
};

export function TableSection({ section }: TableSectionProps) {
  const { control } = useFormContext();
  const { fields: rows, append, remove } = useFieldArray({
    control,
    name: section.name,
  });

  const schema = generateFormSchema(section);
  const defaultValues = generateDefaultValues(section);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const columns: ColumnDef<Record<string, any>, any>[] = section.fields.map((field: Field) => ({
    accessorFn: row => row[field.code],
    id: field.code,
    header: field.title,
    cell: info => resolveFieldDisplayValue(field, info.getValue())
  }));

  columns.push({
    id: "actions",
    cell: ({ row }) => (
      <Button
        size="icon"
        variant="ghost"
        type="button"
        className="h-6 w-6 transition-opacity opacity-0 group-hover:opacity-100"
        onClick={() => remove(row.index)}
      >
        <Trash2 className="!h-3.5 !w-3.5 text-destructive" />
      </Button>
    ),
  });

  const onSubmit = (data: any) => {
    append(data);
    form.reset(defaultValues);
  };

  const allFieldsEmpty = Object.values(
    useWatch({ control: form.control })
  ).every(value => value === undefined || value === null || value === "" || value === false || value === 0);

  return (
    <Form {...form}>
      <fieldset className={cn("border border-input rounded-md p-4 !shadow-sm flex flex-col gap-4")}>
        {section.name && (
          <legend className="text-xs px-2 border rounded-sm font-medium">
            {section.name}
          </legend>
        )}

        <div className="grid grid-cols-2 gap-4">
          {section.fields.map((field: Field) => (
            <div key={field.code} className="flex flex-col gap-2">
              <RenderField field={field} control={form.control} />
            </div>
          ))}
        </div>

        <Button
          size="sm"
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="w-fit justify-self-end self-end"
          disabled={allFieldsEmpty}
        >
          <Plus />
          Agregar
        </Button>

        <DataTable
          className="col-span-2"
          pagination={false}
          columns={columns}
          data={rows}
        />
      </fieldset>
    </Form>
  );
}
