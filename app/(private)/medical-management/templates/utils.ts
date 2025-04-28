import { z } from "zod";
import { newFieldSchema } from "../calendar/schemas/templates";

export const templateStatus = {
  true: {
    label: "Activa",
    bg_color: "bg-blue-100",
    text_color: "text-blue-800",
  },
  false: {
    label: "Inactiva",
    bg_color: "bg-slate-100",
    text_color: "text-slate-800",
  },
};

export const fieldTypes = [
  { label: "Texto", value: "text" },
  { label: "Número", value: "number" },
  { label: "Fecha", value: "date" },
  { label: "Hora", value: "time" },
  { label: "Fecha y hora", value: "datetime" },
  { label: "Archivo", value: "file" },
  { label: "Lista de selección unica", value: "select" },
  { label: "Lista de selección múltiple", value: "multiselect" },
  { label: "Texto largo", value: "textarea" },
  { label: "Título", value: "title" },
  { label: "Índice de masa corporal", value: "imc" },
] as const;

export const propertiesByType: Record<
  z.infer<typeof newFieldSchema>["type"]["primitive_type"],
  (keyof z.infer<typeof newFieldSchema>["type"]["properties"])[]
> = {
  text: ["maxLength", "defaultValue"],
  number: ["maxValue", "minValue", "defaultValue"],
  checkbox: [],
  date: ["defaultValue"],
  datetime: ["defaultValue"],
  time: ["defaultValue"],
  file: [],
  select: ["options"],
  multiselect: ["options"],
  textarea: ["maxLength", "defaultValue"],
  title: [],
  imc: [],
};