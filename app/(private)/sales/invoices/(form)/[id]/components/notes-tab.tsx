import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { InvoiceDetail } from "../../../schemas/invoices";

const fields: FieldDefinition<InvoiceDetail>[] = [
  {
    label: "Notas",
    placeholderLength: 30,
    getValue: (p) => p.internal_notes || "No especificado",
  },
  {
    label: "Términos y condiciones",
    placeholderLength: 30,
    getValue: (p) => p.tyc_notes || "No especificado",
  }
];

export default function NotesTab() {
  const { id } = useParams<{ id: string }>()

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
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
  )
}