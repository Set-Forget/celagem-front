'use client'

import { newFieldSchema, newSectionSchema, SectionDetail, sectionDetailSchema } from "@/app/(private)/medical-management/(masters)/schemas/templates";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCreateFieldMutation, useDeleteSectionMutation, useGetSectionQuery, useUpdateFieldMutation, useUpdateSectionMutation } from "@/lib/services/templates";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, Ellipsis, FormInput, Loader2, Plus, Save, SquarePen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import EditFieldDialog from "../../components/edit-field-dialog";
import NewFieldDialog from "../../components/new-field-dialog";
import { SectionSchema, sectionSchema } from "../../schemas/masters";
import SectionField from "../../templates/[id]/components/section-field";
import { sectionStatus, sectionTypes } from "../utils";
import EditSectionDialog from "./components/edit-section-dialog";
import Dropdown from "@/components/dropdown";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import CustomSonner from "@/components/custom-sonner";
import { toast } from "sonner";

const descriptionFields: FieldDefinition<SectionDetail>[] = [
  {
    label: "Descripción",
    placeholderLength: 14,
    getValue: (p) => p.description || "No especificado",
  },
  {
    label: "Tipo",
    placeholderLength: 10,
    getValue: (p) => sectionTypes.find((t) => t.value === p.type)?.label || "No especificado",
  },
  {
    label: "Fecha de creación",
    placeholderLength: 10,
    getValue: (p) => /* p.created_at || */ "No especificado",
  }
];

export default function Page() {
  const router = useRouter()
  const params = useParams<{ id: string }>();

  const sectionId = Number(params.id)

  const { data: section, isLoading: isSectionLoading } = useGetSectionQuery(sectionId)

  const [updateSection, { isLoading: isUpdatingSection }] = useUpdateSectionMutation()
  const [createField, { isLoading: isCreatingField }] = useCreateFieldMutation()
  const [updateField, { isLoading: isUpdatingField }] = useUpdateFieldMutation()
  const [deleteSection, { isLoading: isDeletingSection }] = useDeleteSectionMutation()

  const normalizedSectionSchema = sectionDetailSchema.transform((section) => {
    const allFields = section.fields;
    const normalizedSection = {
      ...section,
      fields: section.fields.map((f) => f.id),
    };
    return {
      kind: "section",
      section: normalizedSection,
      fields: allFields,
    };
  }).pipe(sectionSchema);

  const normalizedSection = section && normalizedSectionSchema.parse(section)

  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      kind: "section",
      section: {
        id: 0,
        name: "",
        type: "form",
        description: "",
        is_active: true,
        is_for_print_in_columns: false,
        fields: [],
      },
      fields: undefined,
    },
  });

  const onSubmit = async (data: SectionSchema) => {
    if (!normalizedSection) {
      console.warn("No se ha podido obtener la sección normalizada");
      return;
    }

    const { section: oldSection, fields: oldFields } = normalizedSection;
    const { section: newSection, fields: newFields } = data;

    const newFieldsList = newFields.filter(f => !oldFields.some(of => of.id === f.id));
    const updatedFieldsList = newFields.filter(f => {
      const old = oldFields.find(of => of.id === f.id)!;
      return old && JSON.stringify(old) !== JSON.stringify(f);
    });

    const localToRealFieldId: Record<number, number> = {};

    for (const f of newFieldsList) {
      try {
        const payload = newFieldSchema.parse(f);
        const created = await createField(payload).unwrap();
        localToRealFieldId[f.id] = created.data.id;
      } catch (err) {
        console.error("Error creando campo:", err);
      }
    }

    for (const f of updatedFieldsList) {
      try {
        const realId = localToRealFieldId[f.id] ?? f.id;
        const payload = newFieldSchema.parse(f);
        await updateField({ ...payload, id: realId }).unwrap();
      } catch (err) {
        console.error("Error actualizando campo:", err);
      }
    }

    try {
      const finalFieldIds = newSection.fields.map(
        fid => localToRealFieldId[fid] ?? fid
      );
      const sectionToUpdate: z.infer<typeof newSectionSchema> = {
        ...newSection,
        id: oldSection.id,
        fields: finalFieldIds,
      };

      const response = await updateSection(sectionToUpdate).unwrap();
      if (response.status === "SUCCESS") {
        toast.custom((t) => <CustomSonner t={t} description="Sección actualizada exitosamente" />)
      }
    } catch (err) {
      toast.custom((t) => <CustomSonner t={t} description="Error actualizando sección" variant="error" />)
      console.error("Error actualizando sección:", err);
    }
  };

  const handleDeleteSection = async () => {
    if (!section) return;
    try {
      await deleteSection(section.id).unwrap();
      toast.custom((t) => <CustomSonner t={t} description="Sección eliminada exitosamente" />)

      router.push("/medical-management/sections")
    } catch (err) {
      toast.custom((t) => <CustomSonner t={t} description="Error eliminando sección" variant="error" />)
      console.error("Error eliminando sección:", err);
    }
  };

  const status = sectionStatus[section?.is_active.toString() as keyof typeof sectionStatus]
  const fields = useWatch({ control: form.control, name: "fields" });

  const { isDirty } = form.formState;

  useEffect(() => {
    if (!section) return
    form.reset({
      kind: "section",
      ...normalizedSection
    })
  }, [section])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  console.log("Section", isSectionLoading, section, normalizedSection)
  console.log("Fields", fields)

  return (
    <div className="flex flex-col h-full">
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isSectionLoading ? "blur-[4px]" : "blur-none")}>
          {!section ? placeholder(14, true) : section.name}
        </h1>
      }>
        <div className="mr-auto">
          <Badge
            variant="custom"
            className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
          >
            {status?.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown
            trigger={
              <Button size="icon" variant="outline" className="h-8 w-8">
                <Ellipsis />
              </Button>
            }
          >
            <DropdownMenuItem
              onSelect={() => setDialogsState({ open: "edit-section", payload: { sectionId: normalizedSection?.section.id } })}
            >
              <SquarePen />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleDeleteSection}
              loading={isDeletingSection}
              className="text-destructive focus:text-destructive"
            >
              <CircleX className={cn(isDeletingSection && "hidden")} />
              Eliminar
            </DropdownMenuItem>
          </Dropdown>
          <Button
            className="ml-auto"
            size="sm"
            disabled={isSectionLoading || isUpdatingSection || isCreatingField || isUpdatingField}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isUpdatingSection || isCreatingField || isUpdatingField ? <Loader2 className="animate-spin" /> : <Save />}
            Guardar sección
          </Button>
        </div>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        {descriptionFields.map((field) => {
          const displayValue = isSectionLoading
            ? placeholder(field.placeholderLength)
            : field.getValue(section!) ?? "";
          return (
            <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
              <label className="text-muted-foreground text-sm">
                {field.label}
              </label>
              <span
                className={cn(
                  "text-sm transition-all duration-300",
                  isSectionLoading ? "blur-[4px]" : "blur-none"
                )}
              >
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
      <Separator />
      <Form {...form}>
        <TooltipProvider delayDuration={0}>
          <div className="flex flex-col gap-4 p-4 h-full relative">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium">Campos</h2>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                onClick={() => setDialogsState({ open: "new-field", payload: { sectionId: sectionId } })}
              >
                <Plus />
              </Button>
            </div>
            <div className="flex flex-col gap-4 bg-sidebar rounded-lg shadow-lg shadow-sidebar h-full p-4">
              {isSectionLoading && (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((field) => (
                    <div key={field} className="flex flex-col gap-2">
                      <span className="text-sm blur-[4px]">
                        {placeholder(9)}
                      </span>
                      <span className="blur-[2px] border rounded-md h-9 bg-background"></span>
                    </div>
                  ))}
                </div>
              )}
              {fields?.length === 0 && !isSectionLoading && (
                <div className="flex justify-center items-center gap-2">
                  <div className="flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex flex-col gap-4 items-center">
                      <div className="bg-background p-3 rounded-full shadow-lg shadow-background">
                        <FormInput className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-xs">
                        No hay campos en esta sección, podes agregar uno haciendo click en el botón de (+)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {normalizedSection?.section && (
                <SectionField sectionId={normalizedSection?.section.id} isTable={normalizedSection?.section.type !== "form"} />
              )}
            </div>
          </div>
        </TooltipProvider>
        <NewFieldDialog />
        <EditFieldDialog />
        <EditSectionDialog />
      </Form>
    </div>
  )
}