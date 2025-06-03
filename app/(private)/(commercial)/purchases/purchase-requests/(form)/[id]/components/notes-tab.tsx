import RenderFields from "@/components/render-fields";
import { useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PurchaseRequestDetail } from "../../../schemas/purchase-requests";
import { AdaptedPurchaseRequestDetail } from "@/lib/adapters/purchase-requests";

const fields: FieldDefinition<AdaptedPurchaseRequestDetail>[] = [
  {
    label: "Notas",
    placeholderLength: 30,
    render: (p) => p?.internal_notes || "No especificado",
  },
  {
    label: "Términos y condiciones",
    placeholderLength: 30,
    render: (p) => p?.tyc_notes || "No especificado",
  }
];

export default function NotesTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } = useGetPurchaseRequestQuery(id)

  return <RenderFields
    fields={fields}
    loading={isPurchaseRequestLoading}
    data={purchaseRequest}
    className="p-4"
  />
}