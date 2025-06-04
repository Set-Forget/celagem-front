import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { AdaptedCreditNoteDetail } from "@/lib/adapters/credit-notes";
import { AdaptedDebitNoteDetail } from "@/lib/adapters/debit-notes";
import { routes } from "@/lib/routes";
import { useGetCreditNoteQuery } from "@/lib/services/credit-notes";
import { useGetDebitNoteQuery } from "@/lib/services/debit-notes";
import { FieldDefinition } from "@/lib/utils";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DocumentsTab() {
  const { id, scope } = useParams<{ id: string, scope: "purchases" | "sales" }>()

  const fields: FieldDefinition<AdaptedCreditNoteDetail>[] = [
    {
      label: "Factura",
      placeholderLength: 14,
      show: (p) => !!p?.associated_invoice,
      render: (p) => (
        <div className="grid grid-cols-1 justify-items-start" key={p?.associated_invoice?.id}>
          <Button
            key={p?.associated_invoice?.id}
            variant="link"
            className="p-0 h-auto text-foreground"
            asChild
          >
            <Link
              href={
                scope === "purchases"
                  ? routes.purchaseDebitNote.detail(p?.associated_invoice?.id)
                  : routes.salesCreditNote.detail(p?.associated_invoice?.id)
              }
              target="_blank"
            >
              {p?.associated_invoice?.sequence_id}
            </Link>
          </Button>
        </div>
      )
    }
  ];

  const { data: creditNote, isLoading: isCreditNoteLoading } = useGetCreditNoteQuery(id);

  return (
    <div className="flex flex-col p-4">
      {creditNote?.associated_invoice ? (
        <div className="flex flex-col gap-4 items-center col-span-full">
          <div className="bg-secondary p-3 rounded-full shadow-lg shadow-secondary">
            <FileX2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs">
            No hay documentos asociados a esta nota de débito
          </p>
        </div>
      ) : (
        <RenderFields
          fields={fields}
          data={creditNote}
          loading={isCreditNoteLoading}
        />
      )}
    </div>
  )
}