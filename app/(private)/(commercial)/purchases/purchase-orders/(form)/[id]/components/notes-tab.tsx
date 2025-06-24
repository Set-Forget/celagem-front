import RenderFields from "@/components/render-fields";
import { AdaptedPurchaseOrderDetail } from "@/lib/adapters/purchase-order";
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";

const fields: FieldDefinition<AdaptedPurchaseOrderDetail>[] = [
  {
    label: "Notas",
    placeholderLength: 30,
    render: (p) => p.internal_notes || "No especificado",
  },
  {
    label: "Términos y condiciones",
    placeholderLength: 30,
    render: (p) => p.tyc_notes || "No especificado",
  },
  {
    label: "Nota de rechazo",
    placeholderLength: 30,
    show: (p) => !!p.rejection_reason,
    render: (p) => p.rejection_reason || "No especificado",
  }
];

export default function NotesTab() {
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