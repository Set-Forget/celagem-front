import { useFormContext, useWatch } from "react-hook-form";
import { NormalizedSchema } from "../schemas/masters";
import { Field } from "../schemas/templates";
import { useUpdateSectionMutation, useUpdateFieldMutation } from "@/lib/services/templates";
import { toast } from "sonner";
import CustomSonner from "@/components/custom-sonner";
import { useSendMessageMutation } from "@/lib/services/telegram";

const opts = { shouldDirty: true, shouldValidate: true };

export function useSectionFields(sectionId: number) {
  const { control, getValues, setValue } = useFormContext<NormalizedSchema>();

  const [sendMessage] = useSendMessageMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [updateField] = useUpdateFieldMutation();

  const kind = useWatch({ name: "kind", control });
  const sections = useWatch({ name: "sections", control });
  const singleIds = useWatch({ name: "section.fields", control })
  const allFields = useWatch({ name: "fields", control });

  const ids: number[] = (() => {
    if (kind === "template" && Array.isArray(sections)) {
      const idx = sections.findIndex((s) => s.id === sectionId);
      return idx === -1 ? [] : (sections[idx].fields as number[]);
    }
    if (kind === "section" && Array.isArray(singleIds)) {
      return singleIds;
    }
    return [];
  })();

  const fields = ids.map((id) => allFields.find((f) => f.id === id)) as Field[];

  function read() {
    const data = getValues();
    if (data.kind === "template") {
      const idx = data.sections.findIndex((s) => s.id === sectionId);
      if (idx === -1) return null;
      return {
        path: `sections.${idx}.fields` as const,
        arr: data.sections[idx].fields,
      };
    }
    return { path: "section.fields" as const, arr: data.section.fields };
  }

  function write(newIds: number[]) {
    const info = read();
    if (!info) return;
    setValue(info.path, newIds, opts);

    const data = getValues();
    let sectionToUpdate: Parameters<typeof updateSection>[0] | null = null;

    if (data.kind === "section") {
      sectionToUpdate = { ...data.section, id: data.section.id, fields: newIds };
    } else if (data.kind === "template") {
      const idx = data.sections.findIndex((s) => s.id === sectionId);
      if (idx !== -1) {
        const targetSection = data.sections[idx];
        sectionToUpdate = { ...targetSection, id: sectionId, fields: newIds } as any;
      }
    }

    const globalFields = getValues("fields") as Field[];
    newIds.forEach((fid, idx) => {
      const fieldObj = globalFields.find((f) => f.id === fid);
      if (fieldObj && fieldObj.order !== idx) {
        updateField({ ...fieldObj, order: idx, id: fieldObj.id });
      }
    });

    if (sectionToUpdate) {
      updateSection(sectionToUpdate);
    }
  }

  async function remove(fieldId: number) {
    const info = read();
    if (!info) return;

    write(info.arr.filter((id) => id !== fieldId));

    const global = getValues("fields");
    const remainingFields = global.filter((f) => f.id !== fieldId);
    setValue("fields", remainingFields, opts);

    const data = getValues();
    let sectionToUpdate: Parameters<typeof updateSection>[0] | null = null;

    if (data.kind === "section") {
      sectionToUpdate = { ...data.section, id: data.section.id, fields: info.arr.filter((id) => id !== fieldId) };
    } else if (data.kind === "template") {
      const idx = data.sections.findIndex((s) => s.id === sectionId);
      if (idx !== -1) {
        const targetSection = data.sections[idx];
        sectionToUpdate = { ...targetSection, id: sectionId, fields: info.arr.filter((id) => id !== fieldId) } as any;
      }
    }

    const syncPromises: Promise<unknown>[] = [];
    if (sectionToUpdate) {
      syncPromises.push(updateSection(sectionToUpdate).unwrap());
    }

    remainingFields.forEach((field, idx) => {
      if (field.order !== idx) {
        syncPromises.push(updateField({ ...field, id: field.id, order: idx }).unwrap());
      }
    });

    try {
      await Promise.all(syncPromises);
    } catch (error) {
      toast.custom((t) => (
        <CustomSonner t={t} description="Error eliminando campo" variant="error" />
      ));
      sendMessage({
        location: "app/(private)/medical-management/(masters)/templates/[id]/components/section-field.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
    }
  }

  function move(fieldId: number, dir: -1 | 1) {
    const info = read();
    if (!info) return;

    const idx = info.arr.indexOf(fieldId);
    const next = idx + dir;
    if (idx === -1 || next < 0 || next >= info.arr.length) return;

    const newIds = [...info.arr];
    [newIds[idx], newIds[next]] = [newIds[next], newIds[idx]];
    write(newIds);
  }

  return {
    ids,
    fields,
    remove,
    moveUp: (id: number) => move(id, -1),
    moveDown: (id: number) => move(id, 1),
  };
}
