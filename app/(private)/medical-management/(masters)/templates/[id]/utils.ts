import { isEqual } from "lodash";
import { NewField, NewSection } from "../../schemas/templates";
import { NormalizedSchema } from "../../schemas/masters";

export const propFieldAdapter = {
  "defaultValue": "Valor por defecto",
  "maxLength": "Longitud máxima",
  "minLength": "Longitud mínima",
  "maxValue": "Valor máximo",
  "minValue": "Valor mínimo",
  "options": "Opciones"
}

function cloneWithoutId<T extends object>(item: T): Omit<T, "id"> {
  const cloned = structuredClone(item) as any;
  delete cloned.id;
  return cloned;
}

function deepEqualIgnoringId<T extends object>(a: T, b: T): boolean {
  const cleanA = cloneWithoutId(a);
  const cleanB = cloneWithoutId(b);
  return isEqual(cleanA, cleanB);
}

export function getDiffs(original: NormalizedSchema, updated: NormalizedSchema) {
  if (original.kind !== 'template' || updated.kind !== 'template') return

  const originalSectionsMap = new Map<number, NewSection>();
  for (const s of original.sections) {
    originalSectionsMap.set(s.id, s);
  }

  const originalFieldsMap = new Map<number, (Omit<NewField, "id"> & { id: number })>();
  for (const f of original.fields) {
    originalFieldsMap.set(f.id, f);
  }

  // --- Acumuladores ---
  const newSections: NewSection[] = [];
  const updatedSections: NewSection[] = [];
  const deletedSections: NewSection[] = [];

  const newFields: (Omit<NewField, "id"> & { id: number })[] = [];
  const updatedFields: (Omit<NewField, "id"> & { id: number })[] = [];
  const deletedFields: (Omit<NewField, "id"> & { id: number })[] = [];

  for (const sec of updated.sections) {
    const oldSec = originalSectionsMap.get(sec.id);
    if (!oldSec) {
      newSections.push(sec);
    } else {
      if (!deepEqualIgnoringId(oldSec, sec)) {
        updatedSections.push(sec);
      }
      originalSectionsMap.delete(sec.id);
    }
  }

  for (const [_, sec] of originalSectionsMap) {
    deletedSections.push(sec);
  }

  for (const field of updated.fields) {
    const oldField = originalFieldsMap.get(field.id);
    if (!oldField) {
      newFields.push(field);
    } else {
      if (!deepEqualIgnoringId(oldField, field)) {
        updatedFields.push(field);
      }
      originalFieldsMap.delete(field.id);
    }
  }

  for (const [_, field] of originalFieldsMap) {
    deletedFields.push(field);
  }

  return {
    newSections,
    updatedSections,
    deletedSections,
    newFields,
    updatedFields,
    deletedFields,
  };
}
