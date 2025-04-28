import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PurchaseOrderDetail } from "../../schemas/purchase-orders";

const fields: FieldDefinition<PurchaseOrderDetail>[] = [
  {
    label: "Proveedor",
    placeholderLength: 14,
    getValue: (p) => p.supplier.name,
  },
  {
    label: "Teléfono",
    placeholderLength: 9,
    getValue: (p) => p.supplier.phone || "No especificado",
  },
  {
    label: "Correo electrónico",
    placeholderLength: 9,
    getValue: (p) => p.supplier.email || "No especificado",
  },
  {
    label: "Dirección",
    placeholderLength: 20,
    getValue: (p) => p.supplier.address || "No especificado",
  }
];

export default function SupplierTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(id);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isPurchaseOrderLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(purchaseOrder!) ?? "";
        return (
          <div className="flex flex-col gap-1" key={field.label}>
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                isPurchaseOrderLoading ? "blur-[4px]" : "blur-none"
              )}
            >
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  )
}