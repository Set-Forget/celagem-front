'use client'

import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn, placeholder } from "@/lib/utils";
import { useCreateFieldMutation, useCreateSectionMutation, useGetTemplateQuery, useUpdateFieldMutation, useUpdateSectionMutation, useUpdateTemplateMutation } from "@/lib/services/templates";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Plus, PlusSquare, Save, SquarePen, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { newFieldSchema, newSectionSchema, newTemplateSchema, templateDetailSchema } from "../../calendar/schemas/templates";
import { templateStatus } from "../utils";
import EditFieldDialog from "./components/edit-field-dialog";
import EditSectionDialog from "./components/edit-section-dialog";
import NewFieldDialog from "./components/new-field-dialog";
import NewSectionDialog from "./components/new-section-dialog";
import TemplateSection from "./components/template-section";
import { getDiffs } from "./utils";
import EditTemplateDialog from "./components/edit-template-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ImportSectionDialog from "./components/import-section-dialog";

const normalizedSchema = z.object({
  template: newTemplateSchema,
  sections: z.array(newSectionSchema),
  fields: z.array(newFieldSchema)
})

export type NormalizedSchema = z.infer<typeof normalizedSchema>

export default function Page() {
  const params = useParams<{ id: string }>();

  const id = Number(params.id)

  const { data: template, isLoading: isTemplateLoading } = useGetTemplateQuery(id)

  const [updateTemplate, { isLoading: isUpdatingTemplate }] = useUpdateTemplateMutation()
  const [createSection, { isLoading: isCreatingSection }] = useCreateSectionMutation()
  const [updateSection, { isLoading: isUpdatingSection }] = useUpdateSectionMutation()
  const [createField, { isLoading: isCreatingField }] = useCreateFieldMutation()
  const [updateField, { isLoading: isUpdatingField }] = useUpdateFieldMutation()

  const normalizedTemplateSchema = templateDetailSchema.transform((template) => {
    const allFields = template.sections.flatMap((section) => section.fields);
    const normalizedSections = template.sections.map((section) => ({ ...section, fields: section.fields.map((field) => field.id) }));
    const normalizedTemplate = { ...template, sections: template.sections.map((section) => section.id) };

    return {
      template: normalizedTemplate,
      sections: normalizedSections,
      fields: allFields
    };
  }).pipe(normalizedSchema)

  const normalizedTemplate = template && normalizedTemplateSchema.parse(template)

  const form = useForm<z.infer<typeof normalizedSchema>>({
    resolver: zodResolver(normalizedSchema),
  });

  const onSubmit = async (data: NormalizedSchema) => {
    if (!normalizedTemplate) {
      return console.warn("No se ha podido obtener la plantilla normalizada");
    }

    const oldTemplate = normalizedTemplate.template;
    const oldSections = normalizedTemplate.sections;
    const oldFields = normalizedTemplate.fields;

    const diffs = getDiffs(
      { template: oldTemplate, sections: oldSections, fields: oldFields },
      data
    );

    const {
      newSections,
      updatedSections,
      deletedSections,
      newFields,
      updatedFields,
    } = diffs;

    const localToRealSectionId: Record<number, number> = {};

    for (const sec of newSections) {
      try {
        const { fields, ...secWithoutFields } = sec;
        const createdSec = await createSection(secWithoutFields).unwrap();
        localToRealSectionId[sec.id] = createdSec.data.id;

        updatedSections.push({
          ...sec,
          id: createdSec.data.id,
        });
      } catch (err) {
        console.error("Error creando sección:", err);
      }
    }

    const localToRealFieldId: Record<number, number> = {};
    for (const f of newFields) {
      try {
        const createdField = await createField(f).unwrap();
        localToRealFieldId[f.id] = createdField.data.id;
      } catch (err) {
        console.error("Error creando field:", err);
      }
    }

    for (const sec of updatedSections) {
      try {
        const realSecId = localToRealSectionId[sec.id] ?? sec.id;
        const finalFieldIds = sec.fields.map((fid) =>
          localToRealFieldId[fid] ?? fid
        );

        const secToUpdate = {
          ...sec,
          id: realSecId,
          fields: finalFieldIds,
        };
        await updateSection(secToUpdate).unwrap();
      } catch (err) {
        console.error("Error actualizando sección:", err);
      }
    }

    for (const fld of updatedFields) {
      try {
        const realFieldId = localToRealFieldId[fld.id] ?? fld.id;
        await updateField({ ...fld, id: realFieldId }).unwrap();
      } catch (err) {
        console.error("Error actualizando field:", err);
      }
    }

    try {
      const deletedSectionIds = new Set(deletedSections.map((ds) => ds.id));
      const finalSectionIds = data.sections
        .filter((sec) => !deletedSectionIds.has(sec.id))
        .map((sec) => localToRealSectionId[sec.id] ?? sec.id);

      const templateToUpdate = {
        ...data.template,
        sections: finalSectionIds,
      };
      await updateTemplate(templateToUpdate).unwrap();
    } catch (err) {
      console.error("Error actualizando template:", err);
    }
  };

  const handleRemoveSection = (sectionId?: number) => {
    if (!sectionId) return console.warn("No se ha proporcionado un ID de sección para eliminar");

    const currentSections = form.getValues("sections")
    const updatedSections = currentSections.filter((section) => section.id !== sectionId);
    form.setValue("sections", updatedSections, { shouldDirty: true, shouldValidate: true });

    const currentFields = form.getValues("fields")
    const updatedFields = currentFields.filter((field) => field.section_id !== sectionId);
    form.setValue("fields", updatedFields, { shouldDirty: true, shouldValidate: true });
  }

  const sections = useWatch({ control: form.control, name: "sections" })
  const status = templateStatus[template?.isActive.toString() as keyof typeof templateStatus]

  useEffect(() => {
    if (!template) return
    form.reset({
      template: normalizedTemplate!.template,
      sections: normalizedTemplate!.sections,
      fields: normalizedTemplate!.fields
    })
  }, [template])

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isTemplateLoading ? "blur-[4px]" : "blur-none")}>
          {!template ? placeholder(14, true) : template.name}
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
        <Button
          className="ml-auto"
          size="sm"
          disabled={isTemplateLoading || isCreatingSection || isUpdatingSection || isCreatingField || isUpdatingField || isUpdatingTemplate}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isCreatingSection || isUpdatingSection || isCreatingField || isUpdatingField || isUpdatingTemplate ? <Loader2 className="animate-spin" /> : <Save />}
          Guardar plantilla
        </Button>
      </Header>
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">General</h2>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={() => setDialogsState({ open: "edit-template", payload: { templateId: template?.id } })}
            >
              <SquarePen />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1 grid-cols-2">
              <label className="text-muted-foreground text-sm">Descripción</label>
              <span className={cn("text-sm transition-all duration-300", isTemplateLoading ? "blur-[4px]" : "blur-none")}>
                {!template ? placeholder(10) : template?.description ?? "Sin descripción"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de creación</label>
              <span className={cn("text-sm transition-all duration-300", isTemplateLoading ? "blur-[4px]" : "blur-none")}>
                {!template ? placeholder(13) : format(template?.createdAt, "dd MMM yyyy", { locale: es })}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <TooltipProvider delayDuration={0}>
          <div className="grid grid-cols-1 gap-4 p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium">Secciones</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                  >
                    <Plus />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setDialogsState({ open: "new-section" })}
                    >
                      Crear sección
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDialogsState({ open: "import-section" })}
                    >
                      Importar sección
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-4">
              {sections?.length === 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-muted-foreground text-sm">No hay secciones en esta plantilla</p>
                </div>
              )}
              {sections?.map((section) => (
                <ContextMenu modal={false} key={section.id}>
                  <ContextMenuTrigger className="flex flex-col">
                    <TemplateSection
                      key={section.id}
                      section={section}
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-64">
                    <ContextMenuLabel className="py-0.5">
                      {section.name}
                    </ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onClick={() => setDialogsState({ open: "new-field", payload: { sectionId: section.id } })}
                      className="gap-1.5"
                    >
                      <PlusSquare className="w-4 h-4" />
                      Nuevo campo
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => setDialogsState({ open: "edit-section", payload: { sectionId: section.id } })}
                      className="gap-1.5"
                    >
                      <SquarePen className="w-4 h-4" />
                      Editar
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onClick={() => handleRemoveSection(section.id)}
                      className="gap-1.5 text-destructive focus:!text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          </div>
        </TooltipProvider>
        <NewFieldDialog />
        <EditFieldDialog />
        <NewSectionDialog />
        <ImportSectionDialog />
        <EditSectionDialog />
        <EditTemplateDialog />
      </Form>
    </div>
  )
}