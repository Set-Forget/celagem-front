import { StatusIndicator } from "@/components/status-indicator";
import { useGetCustomerQuery } from "@/lib/services/customers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { CustomerDetail } from "../../../schema/customers";

const fields: FieldDefinition<CustomerDetail>[] = [
  {
    label: "Moneda",
    placeholderLength: 16,
    getValue: (p) => p.currency.name || "No especificado",
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
  /*   {
      label: "Cuenta contable",
      placeholderLength: 16,
      getValue: (p) => p.accounting_account || "No especificado",
    }, */
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
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Total facturado</label>
        <div className="flex gap-1.5 items-center">
          <StatusIndicator status="online" size="sm" />
          <span className={cn("text-sm font-medium transition-all duration-300", isCustomerLoading ? "blur-[4px]" : "blur-none")}>
            {isCustomerLoading ? placeholder(4) : customer?.total_invoiced.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Saldo pendiente</label>
        <div className="flex gap-1.5 items-center">
          <StatusIndicator status="away" size="sm" />
          <span className={cn("text-sm font-medium transition-all duration-300", isCustomerLoading ? "blur-[4px]" : "blur-none")}>
            {isCustomerLoading ? placeholder(4) : "xxxxx"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Saldo vencido</label>
        <div className="flex gap-1.5 items-center">
          <StatusIndicator status="busy" size="sm" />
          <span className={cn("text-sm font-medium transition-all duration-300", isCustomerLoading ? "blur-[4px]" : "blur-none")}>
            {isCustomerLoading ? placeholder(4) : "xxxxx"}
          </span>
        </div>
      </div>
    </div>
  )
}