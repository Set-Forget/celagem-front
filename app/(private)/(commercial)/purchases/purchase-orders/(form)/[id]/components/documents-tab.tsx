import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { AdaptedPurchaseOrderDetail } from "@/lib/adapters/purchase-order";
import { routes } from "@/lib/routes";
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { FieldDefinition } from "@/lib/utils";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const fields: FieldDefinition<AdaptedPurchaseOrderDetail>[] = [
  {
    label: "Solicitud de pedido",
    placeholderLength: 14,
    show: (p) => !!p?.purchase_request,
    render: (p) =>
      <Button
        variant="link"
        className="p-0 h-auto text-foreground"
        asChild
      >
        <Link
          href={routes.purchaseRequest.detail(p.purchase_request?.id)}
          target="_blank"
        >
          {p.purchase_request?.sequence_id}
        </Link>
      </Button>
  },
  {
    label: "Facturas de compra",
    placeholderLength: 14,
    show: (p) => !!p?.invoices.length,
    render: (p) => p?.invoices?.map((invoice) => (
      <div className="grid grid-cols-1 justify-items-start" key={invoice.id}>
        <Button
          key={invoice.id}
          variant="link"
          className="p-0 h-auto text-foreground"
          asChild
        >
          <Link
            href={routes.bill.detail(invoice.id)}
            target="_blank"
          >
            {invoice.sequence_id}
          </Link>
        </Button>
      </div>
    ))
  },
  {
    label: "Recepciones de compra",
    placeholderLength: 14,
    show: (p) => !!p?.receptions?.length,
    render: (p) => p?.receptions
      ?.filter((r) => !r.hide)
      ?.map((reception) => (
        <div className="grid grid-cols-1 justify-items-start" key={reception.id}>
          <Button
            key={reception.id}
            variant="link"
            className="p-0 h-auto text-foreground"
            asChild
          >
            <Link
              href={routes.reception.detail(reception.id)}
              target="_blank"
            >
              {reception.sequence_id}
            </Link>
          </Button>
        </div>
      ))
  }
];

export default function DocumentsTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(id)

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
        <RenderFields
          fields={fields}
          loading={isPurchaseOrderLoading}
          data={purchaseOrder}
        />
      )}
    </div>
  )
}