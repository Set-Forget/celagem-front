import { useGetCustomerQuery } from "@/lib/services/customers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { entity_type, fiscal_responsibility, nationality_type, tax_category, tax_information, tax_regime, tax_type } from "../../new/data";
import { CustomerDetail } from "../../../schema/customers";

const fields: FieldDefinition<CustomerDetail>[] = [
  {
    label: "Tipo de documento",
    placeholderLength: 16,
    getValue: (p) => tax_type.find((type) => type.value === p.tax_type)?.label || "No especificado",
  },
  {
    label: "Número de identificación fiscal",
    placeholderLength: 16,
    getValue: (p) => p.tax_id || "No especificado",
  },
  {
    label: "Regimen tributario",
    placeholderLength: 16,
    getValue: (p) => tax_regime.find((regime) => regime.value === p.tax_regime)?.label || "No especificado",
  },
  {
    label: "Actividad económica",
    placeholderLength: 16,
    getValue: (p) => p.economic_activity?.name || "No especificado",
  },
  {
    label: "Tipo de entidad",
    placeholderLength: 16,
    getValue: (p) => entity_type.find((type) => type.value === p.entity_type)?.label || "No especificado",
  },
  {
    label: "Tipo de nacionalidad",
    placeholderLength: 16,
    getValue: (p) => nationality_type.find((type) => type.value === p.nationality_type)?.label || "No especificado",
  },
  {
    label: "Regimen fiscal",
    placeholderLength: 16,
    getValue: (p) => tax_category.find((category) => category.value === p.tax_category)?.label || "No especificado",
  },
  {
    label: "¿Es residente?",
    placeholderLength: 16,
    getValue: (p) => p.is_resident ? "Sí" : "No",
  },
  {
    label: "Información tributaria",
    placeholderLength: 16,
    getValue: (p) => tax_information.find((info) => info.value === p.tax_information)?.label || "No especificado",
  },
  {
    label: "Responsabilidad fiscal",
    placeholderLength: 16,
    getValue: (p) => fiscal_responsibility.find((responsibility) => responsibility.value === p.fiscal_responsibility)?.label || "No especificado",
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