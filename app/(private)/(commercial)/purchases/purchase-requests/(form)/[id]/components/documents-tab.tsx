import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests";
import { FieldDefinition } from "@/lib/utils";
import { FileX2 } from "lucide-react";
import { useParams } from "next/navigation";
import { PurchaseRequestDetail } from "../../../schemas/purchase-requests";
import Link from "next/link";
import { routes } from "@/lib/routes";

const fields: FieldDefinition<PurchaseRequestDetail>[] = [
  {
    label: "Orden de compra",
    placeholderLength: 14,
    show: (p) => !!p?.purchase_order,
    render: (p) =>
      <Button
        variant="link"
        className="p-0 h-auto text-foreground"
        asChild
      >
        <Link
          href={routes.purchaseOrder.detail(p.purchase_order?.id!)}
          target="_blank"
        >
          {p.purchase_order?.name}
        </Link>
      </Button>
  },
];

export default function DocumentsTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } = useGetPurchaseRequestQuery(id)

  return (
    <>
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
          <RenderFields
            fields={fields}
            loading={isPurchaseRequestLoading}
            data={purchaseRequest}
          />
        )}
      </div>
    </>
  )
}