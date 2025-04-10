import { useParams } from "next/navigation";
import { SupplierDetail } from "../../schema/suppliers";
import { useGetSupplierQuery } from "@/lib/services/suppliers";
import { cn, placeholder } from "@/lib/utils";
import { StatusIndicator } from "@/components/status-indicator";

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<SupplierDetail>[] = [
  {
    label: "Moneda",
    placeholderLength: 16,
    getValue: (p) => p.currency || "No especificado",
  },
  {
    label: "Condición de pago",
    placeholderLength: 16,
    getValue: (p) => p.property_payment_term || "No especificado",
  },
  {
    label: "Método de pago",
    placeholderLength: 16,
    getValue: (p) => p.payment_method || "No especificado",
  }
];

export default function AccountingTab() {
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
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Total facturado</label>
        <div className="flex gap-1.5 items-center">
          <StatusIndicator status="online" size="sm" />
          <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
            {isSupplierLoading ? placeholder(4) : supplier?.total_invoiced.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Saldo pendiente</label>
        <div className="flex gap-1.5 items-center">
          <StatusIndicator status="away" size="sm" />
          <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
            {isSupplierLoading ? placeholder(4) : supplier?.payment_amount_due.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Saldo vencido</label>
        <div className="flex gap-1.5 items-center">
          <StatusIndicator status="busy" size="sm" />
          <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
            {isSupplierLoading ? placeholder(4) : supplier?.payment_amount_overdue.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}