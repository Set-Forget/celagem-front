import { useGetBillQuery } from "@/lib/services/bills";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { BillDetail } from "../../../schemas/bills";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RenderFields from "@/components/render-fields";
import { routes } from "@/lib/routes";
import { AdaptedBillDetail } from "@/lib/adapters/bills";

const fields: FieldDefinition<AdaptedBillDetail>[] = [
  {
    label: "Proveedor",
    placeholderLength: 14,
    render: (p) => <Button
      variant="link"
      className="p-0 h-auto text-foreground font-normal"
      asChild
    >
      <Link href={routes.suppliers.detail(p.supplier.id)} target="_blank">
        {p.supplier.name}
      </Link>
    </Button>,
  },
  {
    label: "Número de teléfono",
    placeholderLength: 13,
    render: (p) => p.supplier.phone || "No especificado",
  },
  {
    label: "Correo electrónico",
    placeholderLength: 9,
    render: (p) => <Button
      variant="link"
      className="p-0 h-auto text-foreground font-normal"
      asChild
    >
      <Link
        href={`mailto:${p.supplier.email}`}
        target="_blank"
      >
        {p.supplier.email}
      </Link>
    </Button>
  },
  {
    label: "Dirección",
    placeholderLength: 20,
    render: (p) => p.supplier.address || "No especificado",
  }
];

export default function SupplierTab() {
  const { id } = useParams<{ id: string }>()

  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(id);

  return (
    <RenderFields
      fields={fields}
      loading={isBillLoading}
      data={bill}
      className="p-4"
    />
  )
}