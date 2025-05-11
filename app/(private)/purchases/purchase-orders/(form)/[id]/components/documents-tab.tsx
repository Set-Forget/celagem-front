import { Button } from "@/components/ui/button";
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { cn, placeholder } from "@/lib/utils";
import { Eye, FileX2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function DocumentsTab() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(id)

  const { name: purchaseRequestName, id: purchaseRequestId } = purchaseOrder?.purchase_request || {}

  const invoices = purchaseOrder?.invoices || []
  const receptions = purchaseOrder?.receptions || []

  return (
    <div className="flex flex-col p-4">
      {!purchaseOrder?.purchase_request && purchaseOrder?.invoices.length === 0 && purchaseOrder?.receptions.length === 0 ? (
        <div className="flex flex-col gap-4 items-center col-span-full">
          <div className="bg-secondary p-3 rounded-full shadow-lg shadow-secondary">
            <FileX2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs">
            No hay documentos asociados a esta orden de compra
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {purchaseOrder?.purchase_request && (
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Solicitudes de pedido</label>
              <div className="flex gap-2 items-center group w-fit">
                <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isPurchaseOrderLoading ? "blur-[4px]" : "blur-none")}>
                  {isPurchaseOrderLoading ? placeholder(20, true) : purchaseRequestName}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isPurchaseOrderLoading && "hidden")}
                  onClick={() => router.push(`/purchases/purchase-requests/${purchaseRequestId}`)}
                >
                  <Eye />
                </Button>
              </div>
            </div>
          )}
          {invoices.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Facturas
              </label>
              {invoices.map((invoice) => (
                <div className="flex gap-2 items-center group w-fit" key={invoice.id}>
                  <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isPurchaseOrderLoading ? "blur-[4px]" : "blur-none")}>
                    {isPurchaseOrderLoading ? placeholder(20, true) : invoice.name}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isPurchaseOrderLoading && "hidden")}
                    onClick={() => router.push(`/purchases/bills/${invoice.id}`)}
                  >
                    <Eye />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {receptions.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Recepciones
              </label>
              {receptions.map((reception) => (
                <div className="flex gap-2 items-center group w-fit" key={reception.id}>
                  <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isPurchaseOrderLoading ? "blur-[4px]" : "blur-none")}>
                    {isPurchaseOrderLoading ? placeholder(20, true) : reception.name}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isPurchaseOrderLoading && "hidden")}
                    onClick={() => router.push(`/purchases/purchase-receipts/${reception.id}`)}
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