import { CustomerDetail } from "@/app/(private)/(commercial)/sales/customers/schema/customers";
import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useGetDebitNoteQuery } from "@/lib/services/debit-notes";
import { FieldDefinition } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

const fields: FieldDefinition<Partial<CustomerDetail & { scope: "sales" | "purchases" }>>[] = [
  {
    label: (p) => p.scope === "sales" ? "Cliente" : "Proveedor",
    placeholderLength: 14,
    render: (p) => <Button
      variant="link"
      className="p-0 h-auto text-foreground font-normal"
      asChild
    >
      <Link
        href={p.scope === "sales" ? routes.customers.detail(p.id!) : routes.suppliers.detail(p.id!)}
        target="_blank"
      >
        {p.name}
      </Link>
    </Button>,
  },
  {
    label: "Número de teléfono",
    placeholderLength: 13,
    render: (p) => p.phone || "No especificado",
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
        href={`mailto:${p.email}`}
        target="_blank"
      >
        {p.email}
      </Link>
    </Button>,
  },
]

export default function CustomerTab() {
  const { id, scope } = useParams<{ id: string, scope: "sales" | "purchases" }>()

  const { data: debitNote, isLoading: isDebitNoteLoading } = useGetDebitNoteQuery(id ?? "", {
    skip: !id
  });

  return (
    <RenderFields
      fields={fields}
      loading={isDebitNoteLoading}
      data={{ ...debitNote?.partner, scope }}
      className="p-4"
    />
  )
}