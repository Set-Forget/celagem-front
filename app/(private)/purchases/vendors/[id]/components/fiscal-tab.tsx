import { useGetSupplierQuery } from "@/lib/services/suppliers";
import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { SupplierDetail } from "../../schema/suppliers";

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<SupplierDetail>[] = [
  {
    label: "Tipo de documento",
    placeholderLength: 16,
    getValue: (p) => p.tax_type || "No especificado",
  },
  {
    label: "Número de identificación fiscal",
    placeholderLength: 16,
    getValue: (p) => p.tax_id || "No especificado",
  },
  {
    label: "Regimen tributario",
    placeholderLength: 16,
    getValue: (p) => p.tax_regime || "No especificado",
  },
  {
    label: "Actividad económica",
    placeholderLength: 16,
    getValue: (p) => p.economic_activity || "No especificado",
  },
  {
    label: "Tipo de entidad",
    placeholderLength: 16,
    getValue: (p) => p.entity_type || "No especificado",
  },
  {
    label: "Tipo de nacionalidad",
    placeholderLength: 16,
    getValue: (p) => p.nationality_type || "No especificado",
  },
  {
    label: "Regimen fiscal",
    placeholderLength: 16,
    getValue: (p) => p.tax_category || "No especificado",
  },
  {
    label: "¿Es residente?",
    placeholderLength: 16,
    getValue: (p) => p.is_resident ? "Sí" : "No",
  },
  {
    label: "Información tributaria",
    placeholderLength: 16,
    getValue: (p) => p.tax_information || "No especificado",
  },
  {
    label: "Responsabilidad fiscal",
    placeholderLength: 16,
    getValue: (p) => p.fiscal_responsibility || "No especificado",
  }
];

export default function FiscalTab() {
  const { id } = useParams<{ id: string }>()

  const { data: supplier, isLoading: isSupplierLoading } = useGetSupplierQuery(id)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isSupplierLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(supplier!) ?? "";
        return (
          <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                isSupplierLoading ? "blur-[4px]" : "blur-none"
              )}
            >
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  )
}