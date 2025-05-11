import { Button } from "@/components/ui/button";
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts";
import { cn, placeholder } from "@/lib/utils";
import { Eye, FileX2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function DocumentsTab() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>()

  const { data: purchaseReceipt, isLoading: isPurchaseReceiptLoading } = useGetPurchaseReceiptQuery(id);

  const purchaseOrders = purchaseReceipt?.purchase_orders || [];

  return (
    <div className="p-4 flex flex-col gap-4">
      {!purchaseOrders?.length ? (
        <div className="flex flex-col gap-4 items-center col-span-full">
          <div className="bg-secondary p-3 rounded-full shadow-lg shadow-secondary">
            <FileX2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs">
            No hay documentos asociados a esta orden de compra
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Ordenes de compra</label>
          {purchaseOrders.map((purchaseOrder) => (
            <div className="flex gap-2 items-center group w-fit" key={purchaseOrder.id}>
              <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isPurchaseReceiptLoading ? "blur-[4px]" : "blur-none")}>
                {isPurchaseReceiptLoading ? placeholder(20, true) : purchaseOrder.name}
              </span>
              <Button
                variant="outline"
                size="icon"
                className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isPurchaseReceiptLoading && "hidden")}
                onClick={() => router.push(`/purchases/purchase-orders/${purchaseOrder.id}`)}
              >
                <Eye />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}