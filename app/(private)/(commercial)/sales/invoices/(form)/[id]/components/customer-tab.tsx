import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { FieldDefinition } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InvoiceDetail } from "../../../schemas/invoices";
import { AdaptedInvoiceDetail } from "@/lib/adapters/invoices";

const fields: FieldDefinition<AdaptedInvoiceDetail>[] = [
  {
    label: "Cliente",
    placeholderLength: 14,
    render: (p) => <Button
      variant="link"
      className="p-0 h-auto text-foreground font-normal"
      asChild
    >
      <Link href={routes.customers.detail(p?.customer?.id)} target="_blank">
        {p.customer?.name}
      </Link>
    </Button>,
  },
  {
    label: "Número de teléfono",
    placeholderLength: 13,
    render: (p) => p.customer?.phone || "No especificado",
  },
  {
    label: "Correo electrónico",
    placeholderLength: 10,
    render: (p) => <Button
      variant="link"
      className="p-0 h-auto text-foreground font-normal"
      asChild
    >
      <Link
        href={`mailto:${p.customer?.email}`}
        target="_blank"
      >
        {p.customer?.email}
      </Link>
    </Button>,
  },
  {
    label: "Dirección",
    placeholderLength: 20,
    render: (p) => p.customer?.address || "No especificado",
  }
];

export default function CustomerTab() {
  const { id } = useParams<{ id: string }>()

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id);

  return (
    <RenderFields
      fields={fields}
      loading={isInvoiceLoading}
      data={invoice}
      className="p-4"
    />
  )
}