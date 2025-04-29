import { Field, NewField } from "@/app/(private)/medical-management/calendar/schemas/templates";
import { templateFields } from "@/app/(private)/medical-management/utils";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";

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

export default function SectionField({ field }: { field: Omit<NewField, "id"> & { id: number } }) {
  const FieldComponent = field.type.primitive_type !== 'title'
    ? templateFields[field.type.primitive_type as keyof typeof templateFields]
    : null;

  const defaultValue = generateDefaultValues(field)[field.code];

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      {field.title && (
        <Label
          className={cn(
            !field.is_required && "font-normal text-accent-foreground/75",
            field.type.primitive_type === "title" && "font-semibold py-1"
          )}
        >
          {field.title}
        </Label>
      )}
      {FieldComponent && <FieldComponent field={field} formField={{ value: defaultValue, onChange: () => { } } as ControllerRenderProps} />}
    </div>
  )
}