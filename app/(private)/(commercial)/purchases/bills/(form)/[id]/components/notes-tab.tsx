import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { BillDetail } from "../../../schemas/bills";
import { useGetBillQuery } from "@/lib/services/bills";
import RenderFields from "@/components/render-fields";
import { AdaptedBillDetail } from "@/lib/adapters/bills";

const fields: FieldDefinition<AdaptedBillDetail>[] = [
  {
    label: "Notas",
    placeholderLength: 30,
    render: (p) => p.internal_notes || "No especificado",
  },
  {
    label: "Términos y condiciones",
    placeholderLength: 30,
    render: (p) => p.tyc_notes || "No especificado",
  }
];

export default function NotesTab() {
  const { id } = useParams<{ id: string }>()

  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(id)

  return (
    <RenderFields
      fields={fields}
      loading={isBillLoading}
      data={bill}
      className="p-4"
    />
  )
}