import { Button } from "@/components/ui/button";
import { useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests";
import { cn, placeholder } from "@/lib/utils";
import { Eye, FileX2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function DocumentsTab() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } = useGetPurchaseRequestQuery(id)

  const { name: purchaseOrderName, id: purchaseOrderId } = purchaseRequest?.purchase_order || {}

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {!purchaseRequest?.purchase_order ? (
        <div className="flex flex-col gap-4 items-center col-span-full">
          <div className="bg-secondary p-3 rounded-full shadow-lg shadow-secondary">
            <FileX2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs">
            No hay documentos asociados a esta solicitud de compra
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Ordenes de compra</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isPurchaseRequestLoading ? "blur-[4px]" : "blur-none")}>
              {isPurchaseRequestLoading ? placeholder(20, true) : purchaseOrderName}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isPurchaseRequestLoading && "hidden")}
              onClick={() => router.push(`/purchases/purchase-orders/${purchaseOrderId}`)}
            >
              <Eye />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}