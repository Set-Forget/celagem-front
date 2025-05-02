
export const sectionStatus = {
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

export const sectionTypes = [
  { label: "Formulario", value: "form" },
  { label: "Tabla", value: "table" },
] as const;
