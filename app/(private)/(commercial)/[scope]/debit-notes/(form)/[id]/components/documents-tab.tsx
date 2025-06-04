import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { AdaptedDebitNoteDetail } from "@/lib/adapters/debit-notes";
import { routes } from "@/lib/routes";
import { useGetDebitNoteQuery } from "@/lib/services/debit-notes";
import { FieldDefinition } from "@/lib/utils";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DocumentsTab() {
  const { id, scope } = useParams<{ id: string, scope: "sales" | "purchases" }>()

  const fields: FieldDefinition<AdaptedDebitNoteDetail>[] = [
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
    },
    {
      label: "Registro de pagos",
      placeholderLength: 14,
      show: (p) => !!p?.payments?.length,
      render: (p) => p?.payments?.map((payment) => (
        <div className="grid grid-cols-1 justify-items-start" key={payment.id}>
          <Button
            key={payment.id}
            variant="link"
            className="p-0 h-auto text-foreground"
            asChild
          >
            <Link
              href={routes.payments.detail(payment.id)}
              target="_blank"
            >
              {payment.sequence_id}
            </Link>
          </Button>
        </div>
      ))
    }
  ];

  const { data: debitNote, isLoading: isDebitNoteLoading } = useGetDebitNoteQuery(id);

  return (
    <div className="flex flex-col p-4">
      {debitNote?.associated_invoice && debitNote?.payments?.length === 0 ? (
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
          data={debitNote}
          loading={isDebitNoteLoading}
        />
      )}
    </div>
  )
}