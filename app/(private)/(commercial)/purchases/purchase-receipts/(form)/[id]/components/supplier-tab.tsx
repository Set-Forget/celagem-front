import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts";
import { FieldDefinition } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PurchaseReceiptDetail } from "../../../schemas/purchase-receipts";
import { routes } from "@/lib/routes";

const fields: FieldDefinition<PurchaseReceiptDetail>[] = [
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
    render: (p) => p.supplier.phone,
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
    render: (p) => p.supplier.address,
  }
];

export default function SupplierTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseReceipt, isLoading: isPurchaseReceiptLoading } = useGetPurchaseReceiptQuery(id);

  return (
    <RenderFields
      fields={fields}
      loading={isPurchaseReceiptLoading}
      data={purchaseReceipt}
      className="p-4"
    />
  )
}