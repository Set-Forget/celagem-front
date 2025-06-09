import { Field } from "@/app/(private)/medical-management/(masters)/schemas/templates";
import { templateFields } from "@/app/(private)/medical-management/utils";
import { resolveFieldDisplayValue } from "@/app/(private)/medical-management/visits/(form)/[visit_id]/components/template-view";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Label } from "@/components/ui/label";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Plus, SquarePen, Trash2 } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { useSectionFields } from "../../../hooks/use-section-fields";

const generateDefaultValues = (field: Field): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};

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
    case "multiselect":
      defaultValue = props?.defaultValue ?? [];
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

  return defaults;
};

export default function SectionField({ isTable = false, sectionId }: { isTable?: boolean, sectionId: number }) {
  const { fields: sectionFields, moveUp, moveDown, remove } = useSectionFields(sectionId);

  return (
    <div className={cn("w-full", isTable ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4")}>
      {sectionFields?.map((field) => {
        const FieldComponent = field.type.primitive_type !== 'title' ? templateFields[field.type.primitive_type as keyof typeof templateFields] : null;
        return <ContextMenu modal={false} key={field.id}>
          <div className={cn("field outline outline-transparent outline-1 outline-offset-2 w-full rounded-sm transition-all hover:outline-primary")}>
            <ContextMenuTrigger className="flex flex-col w-full">
              <div className="flex flex-col gap-2 items-start w-full">
                {field.title && (
                  <Label
                    className={cn(!field.is_required && "font-normal text-accent-foreground/75",
                      field.type.primitive_type === "title" && "font-semibold py-1"
                    )}
                  >
                    {field.title}
                  </Label>
                )}
                {FieldComponent && <FieldComponent field={field} formField={{ value: generateDefaultValues(field)[field.code], onChange: () => { } } as ControllerRenderProps} />}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <ContextMenuLabel className="py-0.5">
                {field.title}
              </ContextMenuLabel>
              <ContextMenuSeparator />
              <div className="flex gap-2">
                <ContextMenuItem
                  onClick={() => moveUp(field.id)}
                  className="gap-1.5 w-full"
                >
                  <ArrowUp className="w-4 h-4" />
                  Subir
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => moveDown(field.id)}
                  className="gap-1.5 w-full"
                >
                  <ArrowDown className="w-4 h-4" />
                  Bajar
                </ContextMenuItem>
              </div>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => setDialogsState({ open: "edit-field", payload: { fieldId: field.id } })}
                className="gap-1.5"
              >
                <SquarePen className="w-4 h-4" />
                Editar
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => remove(field.id)}
                className="gap-1.5 text-destructive hover:!text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </ContextMenuItem>
            </ContextMenuContent>
          </div>
        </ContextMenu>
      })}
      {isTable && (
        <>
          <Button
            className="w-fit col-start-2 justify-self-end self-end"
            size="sm"
            disabled
          >
            <Plus />
            Agregar
          </Button>
          <DataTable
            className="col-span-2"
            pagination={false}
            columns={sectionFields.map(field => ({
              accessorFn: (row: Record<number, unknown>) => row[field.id],
              id: String(field.id),
              header: field.title,
              cell: info => resolveFieldDisplayValue(field, info.getValue()),
            }))}
            data={[]}
          />
        </>
      )}
    </div>
  )
}