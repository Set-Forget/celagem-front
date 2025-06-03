import RenderFields from "@/components/render-fields";
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PurchaseOrderDetail } from "../../../schemas/purchase-orders";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { AdaptedPurchaseOrderDetail } from "@/lib/adapters/purchase-order";

const fields: FieldDefinition<AdaptedPurchaseOrderDetail>[] = [
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
    label: "Teléfono",
    placeholderLength: 9,
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

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(id);

  return (
    <RenderFields
      fields={fields}
      loading={isPurchaseOrderLoading}
      data={purchaseOrder}
      className="p-4"
    />
  )
}