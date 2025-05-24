import { InvoiceDetail } from "@/app/(private)/sales/invoices/schemas/invoices";
import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useGetCreditNoteQuery } from "@/lib/services/credit-notes";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { FieldDefinition } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InvoiceTab() {
  const { id, scope } = useParams<{ id: string, scope: "purchases" | "sales" }>()

  const fields: FieldDefinition<InvoiceDetail>[] = [
    {
      label: "Número",
      placeholderLength: 13,
      render: (p) => <Button
        variant="link"
        className="p-0 h-auto text-foreground font-normal"
        asChild
      >
        <Link
          href={
            p?.id
              ? (scope === "purchases"
                ? String(routes.bill.detail(p.id))
                : String(routes.invoice.detail(p.id)))
              : ""
          }
          target="_blank"
        >
          {p?.number || "No especificado"}
        </Link>
      </Button>,
    },
    {
      label: "Fecha de emisión",
      placeholderLength: 13,
      render: (p) => p.date ? format(parseISO(p.date), "dd MMM yyyy", { locale: es }) : "No especificado",
    },
    {
      label: "Fecha de vencimiento",
      placeholderLength: 13,
      render: (p) => p.due_date ? format(parseISO(p.due_date), "dd MMM yyyy", { locale: es }) : "No especificado",
    },
    {
      label: "Condición de pago",
      placeholderLength: 10,
      render: (p) => p.payment_term.name || "No especificado",
    },
    {
      label: "Método de pago",
      placeholderLength: 10,
      render: (p) => p.payment_method?.name || "No especificado",
    }
  ]

  const { data: creditNote, isLoading: isCreditNoteLoading } = useGetCreditNoteQuery(id)
  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(String(creditNote?.associated_invoice?.id ?? ""), {
    skip: !creditNote?.associated_invoice?.id
  });

  return (
    <RenderFields
      fields={fields}
      loading={isCreditNoteLoading || isInvoiceLoading}
      data={invoice}
      className="p-4"
    />
  )
}