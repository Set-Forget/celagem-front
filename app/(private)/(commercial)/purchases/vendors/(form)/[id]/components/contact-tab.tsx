import { useGetSupplierQuery } from "@/lib/services/suppliers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { SupplierDetail } from "../../../schema/suppliers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RenderFields from "@/components/render-fields";

const fields: FieldDefinition<SupplierDetail>[] = [
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
    placeholderLength: 9,
    show: (p) => !!p?.email,
    render: (p) => <Button
      variant="link"
      className="p-0 h-auto text-foreground font-normal"
      asChild
    >
      <Link
        href={p?.email ? `mailto:${p?.email}` : "#"}
        target="_blank"
      >
        {p?.email}
      </Link>
    </Button>
  },
  {
    label: "Página web",
    placeholderLength: 16,
    show: (p) => !!p?.website,
    render: (p) => <Button
      variant="link"
      className="p-0 h-auto text-foreground font-normal"
      asChild
    >
      <Link
        href={p?.website ? p.website : "#"}
        target="_blank"
      >
        {p?.website}
      </Link>
    </Button>
  },
];

export default function ContactTab() {
  const { id } = useParams<{ id: string }>()

  const { data: supplier, isLoading: isSupplierLoading } = useGetSupplierQuery(id)

  return (
    <RenderFields
      fields={fields}
      loading={isSupplierLoading}
      data={supplier}
      className="p-4"
    />
  )
}