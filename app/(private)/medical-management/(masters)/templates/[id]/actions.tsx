import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleX, Ellipsis, Loader2, Save } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { templateStatus } from "../utils";
import { useCreateFieldMutation, useCreateSectionMutation, useDeleteTemplateMutation, useGetTemplateQuery, useUpdateFieldMutation, useUpdateSectionMutation, useUpdateTemplateMutation } from "@/lib/services/templates";
import { TemplateSchema } from "../../schemas/masters";
import { useParams, useRouter } from "next/navigation";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { newFieldSchema } from "../../schemas/templates";
import { toast } from "sonner";
import CustomSonner from "@/components/custom-sonner";
import { getDiffs, normalizedTemplateSchema } from "./utils";
import Dropdown from "@/components/dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function Actions() {
  const router = useRouter()
  const params = useParams<{ id: string }>();

  const { handleSubmit } = useFormContext<TemplateSchema>()

  const [sendMessage] = useSendMessageMutation();
  const [deleteTemplate, { isLoading: isDeletingTemplate }] = useDeleteTemplateMutation()
  const [updateTemplate, { isLoading: isUpdatingTemplate }] = useUpdateTemplateMutation()
  const [createSection, { isLoading: isCreatingSection }] = useCreateSectionMutation()
  const [updateSection, { isLoading: isUpdatingSection }] = useUpdateSectionMutation()
  const [createField, { isLoading: isCreatingField }] = useCreateFieldMutation()
  const [updateField, { isLoading: isUpdatingField }] = useUpdateFieldMutation()

  const id = Number(params.id)

  const { data: template, isLoading: isTemplateLoading } = useGetTemplateQuery(id)

  const status = templateStatus[template?.is_active.toString() as keyof typeof templateStatus]
  const normalizedTemplate = template && normalizedTemplateSchema.parse(template)

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
        sendMessage({
          location: "app/(private)/medical-management/(masters)/templates/[id]/page.tsx",
          rawError: err,
          fnLocation: "onSubmit"
        })
      }
    }

    for (const fld of newFields.filter(f => isTempId(f.id))) {
      try {
        const payload = newFieldSchema.parse(fld);
        const created = await createField(payload).unwrap();
        tmpFldToReal[fld.id] = created.data.id;
      } catch (err) {
        sendMessage({
          location: "app/(private)/medical-management/(masters)/templates/[id]/page.tsx",
          rawError: err,
          fnLocation: "onSubmit"
        })
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
        sendMessage({
          location: "app/(private)/medical-management/(masters)/templates/[id]/page.tsx",
          rawError: err,
          fnLocation: "onSubmit"
        })
      }
    }

    for (const fld of updatedFields) {
      try {
        const realFldId = isTempId(fld.id) ? tmpFldToReal[fld.id] : fld.id;
        const payload = newFieldSchema.parse(fld);
        await updateField({ ...payload, id: realFldId }).unwrap();
      } catch (err) {
        sendMessage({
          location: "app/(private)/medical-management/(masters)/templates/[id]/page.tsx",
          rawError: err,
          fnLocation: "onSubmit"
        })
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
      sendMessage({
        location: "app/(private)/medical-management/(masters)/templates/[id]/page.tsx",
        rawError: err,
        fnLocation: "onSubmit"
      })
    }
  };

  const handleDeleteTemplate = async () => {
    try {
      await deleteTemplate(id).unwrap();
      toast.custom(t => <CustomSonner t={t} description="Plantilla eliminada exitosamente" />);
      router.push("/medical-management/templates");
    } catch (err) {
      toast.custom(t => <CustomSonner t={t} description="Error al eliminar la plantilla" variant="error" />);
    }
  }

  return (
    <>
      <div className="mr-auto">
        <Badge
          variant="custom"
          className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
        >
          {status?.label}
        </Badge>
      </div>
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem
            onSelect={() => handleDeleteTemplate()}
            loading={isDeletingTemplate}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isDeletingTemplate && "hidden")} />
            Eliminar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          className="ml-auto"
          size="sm"
          loading={isTemplateLoading || isCreatingSection || isUpdatingSection || isCreatingField || isUpdatingField || isUpdatingTemplate}
          onClick={handleSubmit(onSubmit)}
        >
          <Save className={cn(isTemplateLoading || isCreatingSection || isUpdatingSection || isCreatingField || isUpdatingField || isUpdatingTemplate && "hidden")} />
          Guardar plantilla
        </Button>
      </div>
    </>
  )
}