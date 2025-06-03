import RenderFields from "@/components/render-fields";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { InvoiceDetail } from "../../../schemas/invoices";
import { AdaptedInvoiceDetail } from "@/lib/adapters/invoices";

const fields: FieldDefinition<AdaptedInvoiceDetail>[] = [
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

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id)

  return (
    <RenderFields
      fields={fields}
      data={invoice}
      loading={isInvoiceLoading}
      className="p-4"
    />
  )
}