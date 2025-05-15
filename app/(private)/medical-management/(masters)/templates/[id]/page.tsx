'use client'

import CustomSonner from "@/components/custom-sonner";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCreateFieldMutation, useCreateSectionMutation, useGetTemplateQuery, useUpdateFieldMutation, useUpdateSectionMutation, useUpdateTemplateMutation } from "@/lib/services/templates";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn, placeholder } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { FormInput, LayoutPanelTop, Loader2, Plus, PlusSquare, Save, SquarePen, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import EditFieldDialog from "../../components/edit-field-dialog";
import NewFieldDialog from "../../components/new-field-dialog";
import { TemplateSchema, templateSchema } from "../../schemas/masters";
import { newFieldSchema, templateDetailSchema } from "../../schemas/templates";
import EditSectionDialog from "../components/edit-section-dialog";
import { templateStatus } from "../utils";
import EditTemplateDialog from "./components/edit-template-dialog";
import ImportSectionDialog from "./components/import-section-dialog";
import NewSectionDialog from "./components/new-section-dialog";
import SectionField from "./components/section-field";
import { getDiffs } from "./utils";

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
      kind: "template",
      template: normalizedTemplate,
      sections: normalizedSections,
      fields: allFields
    };
  }).pipe(templateSchema)

  const normalizedTemplate = template && normalizedTemplateSchema.parse(template)

  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
  });

  const onSubmit = async (data: TemplateSchema) => {
    if (!normalizedTemplate) {
      console.warn("No se ha podido obtener la plantilla normalizada");
      return;
    }

    const isTempId = (id: number) => id < 0;
    const tmpSecToReal: Record<number, number> = {};
    const tmpFldToReal: Record<number, number> = {};

    const { template: oldTemplate, sections: oldSections, fields: oldFields } =
      normalizedTemplate;

    const diffs = getDiffs(
      { kind: "template", template: oldTemplate, sections: oldSections, fields: oldFields },
      data
    ) ?? {
      newSections: [],
      updatedSections: [],
      deletedSections: [],
      newFields: [],
      updatedFields: [],
    };

    const {
      newSections,
      updatedSections,
      deletedSections,
      newFields,
      updatedFields,
    } = diffs;

    for (const sec of newSections.filter(s => isTempId(s.id))) {
      try {
        const { fields, ...payload } = sec;
        const created = await createSection(payload).unwrap();
        tmpSecToReal[sec.id] = created.data.id;
      } catch (err) {
        console.error("Error creando sección:", err);
      }
    }

    for (const fld of newFields.filter(f => isTempId(f.id))) {
      try {
        const payload = newFieldSchema.parse(fld);
        const created = await createField(payload).unwrap();
        tmpFldToReal[fld.id] = created.data.id;
      } catch (err) {
        console.error("Error creando field:", err);
      }
    }

    for (const sec of updatedSections) {
      try {
        const realSecId = isTempId(sec.id)
          ? tmpSecToReal[sec.id]
          : sec.id;

        const finalFieldIds = sec.fields.map(fid =>
          isTempId(fid) ? tmpFldToReal[fid] : fid
        );

        const secToUpdate = { ...sec, id: realSecId, fields: finalFieldIds };
        await updateSection(secToUpdate).unwrap();
      } catch (err) {
        console.error("Error actualizando sección:", err);
      }
    }

    for (const fld of updatedFields) {
      try {
        const realFldId = isTempId(fld.id) ? tmpFldToReal[fld.id] : fld.id;
        const payload = newFieldSchema.parse(fld);
        await updateField({ ...payload, id: realFldId }).unwrap();
      } catch (err) {
        console.error("Error actualizando field:", err);
      }
    }

    try {
      const deletedSecIds = new Set(deletedSections.map(ds => ds.id));

      const finalSectionIds = data.sections
        .filter(sec => !deletedSecIds.has(sec.id))
        .map(sec => (isTempId(sec.id) ? tmpSecToReal[sec.id] : sec.id));

      const templateToUpdate = {
        ...data.template,
        sections: finalSectionIds,
      };

      const res = await updateTemplate(templateToUpdate).unwrap();
      if (res.status === "SUCCESS") {
        toast.custom(t => <CustomSonner t={t} description="Plantilla actualizada exitosamente" />);
      }
    } catch (err) {
      toast.custom(t => <CustomSonner t={t} description="Error al actualizar la plantilla" variant="error" />);
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
  const status = templateStatus[template?.is_active.toString() as keyof typeof templateStatus]

  const { isDirty } = form.formState;

  useEffect(() => {
    if (!template) return
    form.reset({
      kind: "template",
      template: normalizedTemplate!.template,
      sections: normalizedTemplate!.sections,
      fields: normalizedTemplate!.fields
    })
  }, [template])

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

  return (
    <div className="flex flex-col h-full">
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
          <div className="flex gap-2">
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
                {!template ? placeholder(13) : format(parseISO(template?.created_at), "PP", { locale: es })}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <TooltipProvider delayDuration={0}>
          <div className="flex flex-col gap-4 p-4 h-full items-start relative">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium">Secciones</h2>
              <DropdownMenu modal={false}>
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
            <div className="flex flex-col gap-4 w-full h-full p-4 rounded-lg bg-sidebar shadow-lg shadow-sidebar">
              {(isTemplateLoading || !sections) && (
                <div className="flex flex-col gap-4">
                  {[1, 2].map((section) => (
                    <fieldset key={section} className="border border-input rounded-md p-4 bg-background">
                      <legend className="text-xs px-2 border rounded-sm bg-background">
                        <span className="font-medium blur-[4px]">
                          {placeholder(10)}
                        </span>
                      </legend>
                      <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((field) => (
                          <div key={field} className="flex flex-col gap-2">
                            <span className="text-sm blur-[4px]">
                              {placeholder(9)}
                            </span>
                            <span className="bg-accent blur-[2px] border rounded-md h-9"></span>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              )}
              {sections?.length === 0 && (
                <div className="flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex flex-col gap-4 items-center">
                    <div className="bg-background p-3 rounded-full shadow-lg shadow-background">
                      <LayoutPanelTop className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      No hay secciones en esta plantilla, puedes crear una nueva o importar una existente.
                    </p>
                  </div>
                </div>
              )}
              {sections?.map((section) => (
                <ContextMenu modal={false} key={section.id}>
                  <ContextMenuTrigger className="flex flex-col w-full">
                    <div className="flex flex-col gap-4 w-full">
                      <div className="grid grid-cols-1 gap-4 w-full">
                        <fieldset className={cn(
                          "border bg-background border-input rounded-md p-4 !shadow-sm min-w-0 w-full flex flex-col gap-4 hover:[&:not(:has(.field:hover))]:border-primary transition-colors"
                        )}>
                          {section.name && <legend className="text-xs px-2 border rounded-sm font-medium bg-background">{section.name}</legend>}
                          {!section.fields.length ? (
                            <div className="flex justify-center items-center gap-2">
                              <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4 items-center">
                                  <div className="bg-secondary p-3 rounded-full shadow-lg shadow-secondary">
                                    <FormInput className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                  <p className="text-muted-foreground text-xs">
                                    No hay campos en esta sección, podes agregar uno haciendo click derecho en la sección
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) :
                            <SectionField sectionId={section.id} isTable={section.type !== "form"} />
                          }
                        </fieldset>
                      </div>
                    </div>
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