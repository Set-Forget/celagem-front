import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { InvoiceDetail } from "../../../schemas/invoices";
import { useGetInvoiceQuery } from "@/lib/services/invoices";

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<InvoiceDetail>[] = [
  {
    label: "Proveedor",
    placeholderLength: 14,
    getValue: (p) => p.customer?.name || "No especificado",
  },
  {
    label: "Número de teléfono",
    placeholderLength: 13,
    getValue: (p) => p.customer?.phone || "No especificado",
  },
  {
    label: "Correo electrónico",
    placeholderLength: 10,
    getValue: (p) => p.customer?.email || "No especificado",
  },
  {
    label: "Dirección",
    placeholderLength: 20,
    getValue: (p) => p.customer?.address || "No especificado",
  }
];

export default function CustomerTab() {
  const { id } = useParams<{ id: string }>()

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const displayValue = isInvoiceLoading
            ? placeholder(field.placeholderLength)
            : field.getValue(invoice!) ?? "";
          return (
            <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
              <label className="text-muted-foreground text-sm">
                {field.label}
              </label>
              <span
                className={cn(
                  "text-sm transition-all duration-300",
                  isInvoiceLoading ? "blur-[4px]" : "blur-none"
                )}
              >
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )
}