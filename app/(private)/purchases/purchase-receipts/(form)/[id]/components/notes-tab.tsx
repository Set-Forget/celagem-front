import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PurchaseReceiptDetail } from "../../../schemas/purchase-receipts";

const fields: FieldDefinition<PurchaseReceiptDetail>[] = [
  {
    label: "Notas",
    placeholderLength: 30,
    getValue: (p) => p.note || "No especificado",
  },
];

export default function NotesTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseReceipt, isLoading: isPurchaseReceiptLoading } = useGetPurchaseReceiptQuery(id)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isPurchaseReceiptLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(purchaseReceipt!) ?? "";
        return (
          <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
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
  )
}