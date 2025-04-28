import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PurchaseReceiptDetail } from "../../schemas/purchase-receipts";
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts";

const fields: FieldDefinition<PurchaseReceiptDetail>[] = [
  {
    label: "Proveedor",
    placeholderLength: 14,
    getValue: (p) => p.supplier.name,
  },
  {
    label: "Teléfono",
    placeholderLength: 9,
    getValue: (p) => p.supplier.phone,
  },
  {
    label: "Correo electrónico",
    placeholderLength: 9,
    getValue: (p) => p.supplier.email,
  },
  {
    label: "Dirección",
    placeholderLength: 20,
    getValue: (p) => p.supplier.address,
  }
];

export default function SupplierTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseReceipt, isLoading: isPurchaseReceiptLoading } = useGetPurchaseReceiptQuery(id);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-base font-medium">General</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const displayValue = isPurchaseReceiptLoading
            ? placeholder(field.placeholderLength)
            : field.getValue(purchaseReceipt!) ?? "";
          return (
            <div className="flex flex-col gap-1" key={field.label}>
              <label className="text-muted-foreground text-sm">
                {field.label}
              </label>
              <span
                className={cn(
                  "text-sm transition-all duration-300",
                  isPurchaseReceiptLoading ? "blur-[4px]" : "blur-none"
                )}
              >
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )
}