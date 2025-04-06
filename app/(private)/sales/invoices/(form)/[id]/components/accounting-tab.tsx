import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { cn, placeholder } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";
import { InvoiceDetail } from "../../../schemas/invoices";

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<InvoiceDetail>[] = [
  {
    label: "Fecha de contabilización",
    placeholderLength: 14,
    getValue: (p) => p.accounting_date ? format(p.accounting_date, "PPP", { locale: es }) : "No especificado",
  },
  {
    label: "Cuenta contable",
    placeholderLength: 10,
    getValue: (p) => "xxxxx",
  },
  {
    label: "Centro de costos",
    placeholderLength: 13,
    getValue: (p) => "xxxxx",
  }
];

export default function AccountingTab() {
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