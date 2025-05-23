import RenderFields from "@/components/render-fields";
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PurchaseReceiptDetail } from "../../../schemas/purchase-receipts";

const fields: FieldDefinition<PurchaseReceiptDetail>[] = [
  {
    label: "Notas",
    placeholderLength: 30,
    render: (p) => p.note || "No especificado",
  },
];

export default function NotesTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseReceipt, isLoading: isPurchaseReceiptLoading } = useGetPurchaseReceiptQuery(id)

  return (
    <RenderFields
      fields={fields}
      loading={isPurchaseReceiptLoading}
      data={purchaseReceipt}
      className="p-4"
    />
  )
}