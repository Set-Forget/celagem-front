import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts";
import { FieldDefinition } from "@/lib/utils";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PurchaseReceiptDetail } from "../../../schemas/purchase-receipts";

const fields: FieldDefinition<PurchaseReceiptDetail>[] = [
  {
    label: "Orden de compra",
    placeholderLength: 14,
    show: (p) => !!p.purchase_orders.length,
    render: (p) =>
      p.purchase_orders.map((purchaseOrder) => (
        <div className="grid grid-cols-1 justify-items-start" key={purchaseOrder.id}>
          <Button
            key={purchaseOrder.id}
            variant="link"
            className="p-0 h-auto text-foreground"
            asChild
          >
            <Link
              href={routes.purchaseOrder.detail(purchaseOrder.id)}
              target="_blank"
            >
              {purchaseOrder.name}
            </Link>
          </Button>
        </div>
      ))
  },
];

export default function DocumentsTab() {
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
        <RenderFields
          fields={fields}
          loading={isPurchaseReceiptLoading}
          data={purchaseReceipt}
        />
      )}
    </div>
  )
}