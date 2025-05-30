import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { useGetCustomerQuery } from "@/lib/services/customers";
import { FieldDefinition } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CustomerDetail } from "../../../schema/customers";

const fields: FieldDefinition<CustomerDetail>[] = [
  {
    label: "Ciudad",
    placeholderLength: 16,
    render: (p) => p.city || "No especificado",
  },
  {
    label: "Calle",
    placeholderLength: 16,
    render: (p) => p.street || "No especificado",
  },
  {
    label: "Código postal",
    placeholderLength: 16,
    render: (p) => p.zip || "No especificado",
  },
  {
    label: "Telefono",
    placeholderLength: 16,
    render: (p) => p.phone || "No especificado",
  },
  {
    label: "Correo electrónico",
    placeholderLength: 16,
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
    </Button>
  },
];

export default function ContactTab() {
  const { id } = useParams<{ id: string }>()

  const { data: customer, isLoading: isCustomerLoading } = useGetCustomerQuery(id)

  return (
    <RenderFields
      fields={fields}
      loading={isCustomerLoading}
      data={customer}
      className="p-4"
    />
  )
}