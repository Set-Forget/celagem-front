import { useFormContext, useWatch } from "react-hook-form";
import { NormalizedSchema } from "../schemas/masters";
import { Field } from "../schemas/templates";

const opts = { shouldDirty: true, shouldValidate: true };

export function useSectionFields(sectionId: number) {
  const { control, getValues, setValue } = useFormContext<NormalizedSchema>();

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
  }

  function remove(fieldId: number) {
    const info = read();
    if (!info) return;
    write(info.arr.filter((id) => id !== fieldId));

    const global = getValues("fields");
    setValue(
      "fields",
      global.filter((f) => f.id !== fieldId),
      opts,
    );
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
