import RenderFields from "@/components/render-fields";
import { AdaptedPurchaseOrderDetail } from "@/lib/adapters/purchase-order";
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";

const fields: FieldDefinition<AdaptedPurchaseOrderDetail>[] = [
  {
    label: "Condición de pago",
    placeholderLength: 30,
    render: (p) => p?.payment_term?.name || "No especificado",
  },
  {
    label: "Moneda",
    placeholderLength: 30,
    render: (p) => p?.currency?.name || "No especificado",
  }
];

export default function FiscalTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(id)

  return (
    <RenderFields
      fields={fields}
      loading={isPurchaseOrderLoading}
      data={purchaseOrder}
      className="p-4"
    />
  )
}