import { useGetCustomerQuery } from "@/lib/services/customers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { CustomerDetail } from "../../../schema/customers";

const fields: FieldDefinition<CustomerDetail>[] = [
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
    label: "Regimen fiscal",
    placeholderLength: 16,
    getValue: (p) => p.tax_category || "No especificado",
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
  },
  {
    label: "Actividad económica",
    placeholderLength: 16,
    getValue: (p) => p.economic_activity?.name || "No especificado",
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
    label: "¿Es residente?",
    placeholderLength: 16,
    getValue: (p) => p.is_resident ? "Sí" : "No",
  }
];

export default function FiscalTab() {
  const { id } = useParams<{ id: string }>()

  const { data: customer, isLoading: isCustomerLoading } = useGetCustomerQuery(id)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isCustomerLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(customer!) ?? "";
        return (
          <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                isCustomerLoading ? "blur-[4px]" : "blur-none"
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