import { useGetCreditNoteQuery } from "@/lib/services/credit-notes";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { cn, placeholder } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";

export default function InvoiceTab() {
  const { id } = useParams<{ id: string }>()

  const { data: creditNote, isLoading: isCreditNoteLoading } = useGetCreditNoteQuery(id)
  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(String(creditNote?.associated_invoice.id ?? ""), {
    skip: !creditNote?.associated_invoice.id
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Número</label>
        <span className={cn("text-sm transition-all duration-300", isInvoiceLoading || isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isInvoiceLoading || isCreditNoteLoading ? placeholder(13) : invoice?.number || "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Fecha de emisión</label>
        <span className={cn("text-sm transition-all duration-300", isInvoiceLoading || isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isInvoiceLoading || isCreditNoteLoading ? placeholder(13) : invoice?.date ? format(invoice?.date ?? "", "dd MMM yyyy", { locale: es }) : "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Fecha de vencimiento</label>
        <span className={cn("text-sm transition-all duration-300", isInvoiceLoading || isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isInvoiceLoading || isCreditNoteLoading ? placeholder(13) : invoice?.due_date ? format(invoice?.due_date ?? "", "dd MMM yyyy", { locale: es }) : "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Condición de pago</label>
        <span className={cn("text-sm transition-all duration-300", isInvoiceLoading || isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isInvoiceLoading || isCreditNoteLoading ? placeholder(10) : invoice?.payment_term.name || "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Método de pago</label>
        <span className={cn("text-sm transition-all duration-300", isInvoiceLoading || isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isInvoiceLoading || isCreditNoteLoading ? placeholder(10) : invoice?.payment_method?.name || "No especificado"}
        </span>
      </div>
    </div>
  )
}