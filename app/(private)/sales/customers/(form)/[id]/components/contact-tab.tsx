import { useGetCustomerQuery } from "@/lib/services/customers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { CustomerDetail } from "../../../schema/customers";

const fields: FieldDefinition<CustomerDetail>[] = [
  {
    label: "Ciudad",
    placeholderLength: 16,
    getValue: (p) => p.city || "No especificado",
  },
  {
    label: "Calle",
    placeholderLength: 16,
    getValue: (p) => p.street || "No especificado",
  },
  {
    label: "Código postal",
    placeholderLength: 16,
    getValue: (p) => p.zip || "No especificado",
  },
  {
    label: "Telefono",
    placeholderLength: 16,
    getValue: (p) => p.phone || "No especificado",
  },
  {
    label: "Correo electrónico",
    placeholderLength: 16,
    getValue: (p) => p.email || "No especificado",
  },
];

export default function ContactTab() {
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