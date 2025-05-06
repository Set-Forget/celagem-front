import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { cn, placeholder } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function CustomerTab() {
  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Cliente</label>
        <span className={cn("text-sm transition-all duration-300", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
          {isInvoiceLoading ? placeholder(13) : invoice?.customer.name || "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Correo electrónico</label>
        <span className="text-sm">
          {isInvoiceLoading ? placeholder(13) : invoice?.customer.email || "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Número de teléfono</label>
        <span className="text-sm">
          {isInvoiceLoading ? placeholder(13) : invoice?.customer.phone || "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Dirección</label>
        <span className="text-sm">
          {isInvoiceLoading ? placeholder(13) : invoice?.customer.address || "No especificado"}
        </span>
      </div>
    </div>
  )
}