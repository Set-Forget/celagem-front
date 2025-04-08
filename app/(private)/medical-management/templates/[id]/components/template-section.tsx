import { NewSection } from "@/app/(private)/medical-management/calendar/schemas/templates";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Plus, SquarePen, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { NormalizedSchema } from "../page";
import SectionField from "./section-field";

export default function TemplateSection({ section, className }: { section: NewSection, className?: string }) {
  const { control, setValue, getValues } = useFormContext<NormalizedSchema>();
  const fields = useWatch({ name: "fields", control });

  const fieldsMap = fields.reduce((acc, field) => {
    acc[field.id] = field;
    return acc;
  }, {} as Record<number, typeof fields[number]>);

  const sectionFields = section.fields.map(id => fieldsMap[id]).filter((field) => field !== undefined);

  const handleRemoveField = (fieldId: number) => {
    const currentFields = getValues("fields")
    const updatedFields = currentFields.filter((field) => field.id !== fieldId);

    setValue("fields", updatedFields, { shouldDirty: true, shouldValidate: true });

    const currentSections = getValues("sections")

    const sectionIndex = currentSections.findIndex((sec) => sec.id === section.id);
    if (sectionIndex !== -1) {
      const updatedSectionFieldIds = currentSections[sectionIndex].fields.filter((id) => id !== fieldId);
      setValue(`sections.${sectionIndex}.fields`, updatedSectionFieldIds, { shouldDirty: true, shouldValidate: true });
    }
  }

  const handleMoveFieldUp = (fieldId: number) => {
    const currentSections = getValues("sections");
    const sectionIndex = currentSections.findIndex((sec) => sec.id === section.id);
    if (sectionIndex === -1) return;
    const currentFieldIds = currentSections[sectionIndex].fields;
    const idx = currentFieldIds.indexOf(fieldId);
    if (idx > 0) {
      const newFieldIds = [...currentFieldIds];
      [newFieldIds[idx - 1], newFieldIds[idx]] = [newFieldIds[idx], newFieldIds[idx - 1]];
      setValue(`sections.${sectionIndex}.fields`, newFieldIds, { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleMoveFieldDown = (fieldId: number) => {
    const currentSections = getValues("sections");
    const sectionIndex = currentSections.findIndex((sec) => sec.id === section.id);
    if (sectionIndex === -1) return;
    const currentFieldIds = currentSections[sectionIndex].fields;
    const idx = currentFieldIds.indexOf(fieldId);
    if (idx !== -1 && idx < currentFieldIds.length - 1) {
      const newFieldIds = [...currentFieldIds];
      [newFieldIds[idx], newFieldIds[idx + 1]] = [newFieldIds[idx + 1], newFieldIds[idx]];
      setValue(`sections.${sectionIndex}.fields`, newFieldIds, { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 gap-4">
        <fieldset className={cn(
          "border border-input rounded-md p-4 !shadow-sm min-w-0 w-full flex flex-col gap-4 hover:[&:not(:has(.field:hover))]:border-primary transition-colors",
          className
        )}>
          {section.name && <legend className="text-xs px-2 border rounded-sm font-medium">{section.name}</legend>}
          {!sectionFields.length && (
            <div className="flex justify-center items-center gap-2">
              <p className="text-muted-foreground text-sm">
                No hay campos en esta sección
              </p>
              <Button
                size="icon"
                className="h-7 w-7"
                variant="outline"
                onClick={() => setDialogsState({ open: "new-field", payload: { sectionId: section.id } })}
              >
                <Plus />
              </Button>
            </div>
          )}
          {sectionFields?.map((field) => (
            <ContextMenu modal={false} key={field.id}>
              <div className={cn("field ring-transparent ring-1 ring-offset-2 w-full rounded-sm transition-all hover:ring-primary")}>
                <ContextMenuTrigger className="flex flex-col w-full">
                  <SectionField field={field} />
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuLabel className="py-0.5">
                    {field.title}
                  </ContextMenuLabel>
                  <ContextMenuSeparator />
                  <div className="flex gap-2">
                    <ContextMenuItem
                      onClick={() => handleMoveFieldUp(field.id)}
                      className="gap-1.5 w-full"
                    >
                      <ArrowUp className="w-4 h-4" />
                      Subir
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleMoveFieldDown(field.id)}
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
                    onClick={() => handleRemoveField(field.id)}
                    className="gap-1.5 text-destructive hover:!text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </ContextMenuItem>
                </ContextMenuContent>
              </div>
            </ContextMenu>
          ))}
        </fieldset>
      </div>
    </div>
  );
}