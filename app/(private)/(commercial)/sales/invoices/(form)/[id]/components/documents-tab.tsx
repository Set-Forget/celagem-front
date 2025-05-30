import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { FieldDefinition } from "@/lib/utils";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InvoiceDetail } from "../../../schemas/invoices";

const fields: FieldDefinition<InvoiceDetail>[] = [
  {
    label: "Notas de crédito",
    placeholderLength: 14,
    show: (p) => !!p?.credit_notes.length,
    render: (p) => p?.credit_notes?.map((creditNote) => (
      <div className="grid grid-cols-1 justify-items-start" key={creditNote.id}>
        <Button
          key={creditNote.id}
          variant="link"
          className="p-0 h-auto text-foreground"
          asChild
        >
          <Link
            href={routes.salesCreditNote.detail(creditNote.id)}
            target="_blank"
          >
            {creditNote.number}
          </Link>
        </Button>
      </div>
    ))
  },
  {
    label: "Notas de débito",
    placeholderLength: 14,
    show: (p) => !!p?.debit_notes?.length,
    render: (p) => p?.debit_notes?.map((debitNote) => (
      <div className="grid grid-cols-1 justify-items-start" key={debitNote.id}>
        <Button
          key={debitNote.id}
          variant="link"
          className="p-0 h-auto text-foreground"
          asChild
        >
          <Link
            href={routes.salesDebitNote.detail(debitNote.id)}
            target="_blank"
          >
            {debitNote.number}
          </Link>
        </Button>
      </div>
    ))
  },
  {
    label: "Registro de pagos",
    placeholderLength: 14,
    show: (p) => !!p?.charges?.length,
    render: (p) => p?.charges?.map((charge) => (
      <div className="grid grid-cols-1 justify-items-start" key={charge.id} >
        <Button
          key={charge.id}
          variant="link"
          className="p-0 h-auto text-foreground"
          asChild
        >
          <Link
            href={routes.receipts.detail(charge.id)}
            target="_blank"
          >
            {charge.name}
          </Link>
        </Button>
      </div >
    ))
  }
];

export default function DocumentsTab() {
  const { id } = useParams<{ id: string }>()

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id);

  const creditNotes = invoice?.credit_notes || []
  const debitNotes = invoice?.debit_notes || []

  // ! Falta remitos.

  return (
    <div className="flex flex-col p-4">
      {creditNotes.length === 0 && debitNotes.length === 0 && invoice?.charges?.length === 0 ? (
        <div className="flex flex-col gap-4 items-center col-span-full">
          <div className="bg-secondary p-3 rounded-full shadow-lg shadow-secondary">
            <FileX2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs">
            No hay documentos asociados a esta factura
          </p>
        </div>
      ) : (
        <RenderFields
          fields={fields}
          data={invoice}
          loading={isInvoiceLoading}
        />
      )}
    </div>
  )
}