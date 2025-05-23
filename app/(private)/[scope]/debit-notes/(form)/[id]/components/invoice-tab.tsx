import { InvoiceDetail } from "@/app/(private)/sales/invoices/schemas/invoices";
import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useGetDebitNoteQuery } from "@/lib/services/debit-notes";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { FieldDefinition } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";

const fields: FieldDefinition<InvoiceDetail>[] = [
  {
    label: "Número",
    placeholderLength: 13,
    render: (p) => <Button
      variant="link"
      className="p-0 h-auto text-foreground font-normal"
      asChild
    >
      <Link href={p?.id ? routes.invoice.detail(p.id) : "#"} target="_blank">
        {p?.number || "No especificado"}
      </Link>
    </Button>,
  },
  {
    label: "Fecha de emisión",
    placeholderLength: 13,
    render: (p) => p?.date ? format(parseISO(p.date), "dd MMM yyyy", { locale: es }) : "No especificado",
  },
  {
    label: "Fecha de vencimiento",
    placeholderLength: 13,
    render: (p) => p?.due_date ? format(parseISO(p.due_date), "dd MMM yyyy", { locale: es }) : "No especificado",
  },
  {
    label: "Condición de pago",
    placeholderLength: 10,
    render: (p) => p?.payment_term?.name || "No especificado",
  },
  {
    label: "Método de pago",
    placeholderLength: 10,
    render: (p) => p?.payment_method?.name || "No especificado",
  }
]

export default function InvoiceTab() {
  const { id } = useParams<{ id: string }>()

  const { data: debitNote, isLoading: isDebitNoteLoading } = useGetDebitNoteQuery(id)
  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(String(debitNote?.associated_invoice?.id ?? ""), {
    skip: !debitNote?.associated_invoice?.id
  });

  return (
    <RenderFields
      fields={fields}
      loading={isDebitNoteLoading || isInvoiceLoading}
      data={invoice}
      className="p-4"
    />
  )
}