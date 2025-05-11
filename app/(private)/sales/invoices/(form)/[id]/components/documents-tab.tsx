import { Button } from "@/components/ui/button";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { cn, placeholder } from "@/lib/utils";
import { Eye, FileX2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function DocumentsTab() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id);

  const creditNotes = invoice?.credit_notes || []
  const debitNotes = invoice?.debit_notes || []

  // ! Falta remitos.

  return (
    <div className="flex flex-col p-4">
      {creditNotes.length === 0 && debitNotes.length === 0 ? (
        <div className="flex flex-col gap-4 items-center col-span-full">
          <div className="bg-secondary p-3 rounded-full shadow-lg shadow-secondary">
            <FileX2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs">
            No hay documentos asociados a esta factura
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/*           {purchaseOrders.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Órdenes de compra
              </label>
              {purchaseOrders.map((purchaseOrder) => (
                <div className="flex gap-2 items-center group w-fit" key={purchaseOrder.id}>
                  <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
                    {isInvoiceLoading ? placeholder(20, true) : purchaseOrder.name}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isInvoiceLoading && "hidden")}
                    onClick={() => router.push(`/purchases/purchase-orders/${purchaseOrder.id}`)}
                  >
                    <Eye />
                  </Button>
                </div>
              ))}
            </div>
          )} */}
          {creditNotes.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Notas de crédito
              </label>
              {creditNotes.map((creditNote) => (
                <div className="flex gap-2 items-center group w-fit" key={creditNote.id}>
                  <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
                    {isInvoiceLoading ? placeholder(20, true) : creditNote.number}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isInvoiceLoading && "hidden")}
                    onClick={() => router.push(`/credit-notes/${creditNote.id}`)}
                  >
                    <Eye />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {debitNotes.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Notas de débito
              </label>
              {debitNotes.map((debitNote) => (
                <div className="flex gap-2 items-center group w-fit" key={debitNote.id}>
                  <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
                    {isInvoiceLoading ? placeholder(20, true) : debitNote.name}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isInvoiceLoading && "hidden")}
                    onClick={() => router.push(`/purchases/debit-notes/${debitNote.id}`)}
                  >
                    <Eye />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}