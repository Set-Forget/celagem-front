import { useGetCustomerQuery } from "@/lib/services/customers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { CustomerDetail } from "../../../schema/customers";

const fields: FieldDefinition<CustomerDetail>[] = [
  {
    label: "Moneda",
    placeholderLength: 16,
    getValue: (p) => p.currency?.name || "No especificado",
  },
  {
    label: "Condición de pago",
    placeholderLength: 16,
    getValue: (p) => p.property_payment_term?.name || "No especificado",
  },
  {
    label: "Método de pago",
    placeholderLength: 16,
    getValue: (p) => p.payment_method?.name || "No especificado",
  },
  {
    label: "Cuenta contable",
    placeholderLength: 16,
    getValue: (p) => p.account?.name || "No especificado",
  }
];

export default function AccountingTab() {
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