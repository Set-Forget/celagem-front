import { NewField } from "@/app/(private)/medical-management/calendar/schemas/templates";
import { templateFields } from "@/app/(private)/medical-management/utils";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SectionField({ field }: { field: Omit<NewField, "id"> & { id: number } }) {
  const FieldComponent = field.type.primitive_type !== 'title'
    ? templateFields[field.type.primitive_type as keyof typeof templateFields]
    : null;

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
      {FieldComponent && <FieldComponent field={field} />}
    </div>
  )
}