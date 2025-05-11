import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PurchaseOrderDetail } from "../../../schemas/purchase-orders";

const fields: FieldDefinition<PurchaseOrderDetail>[] = [
  {
    label: "Notas",
    placeholderLength: 30,
    getValue: (p) => p.internal_notes || "No especificado",
  },
  {
    label: "Términos y condiciones",
    placeholderLength: 30,
    getValue: (p) => p.tyc_notes || "No especificado",
  }
];

export default function NotesTab() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(id)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isPurchaseOrderLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(purchaseOrder!) ?? "";
        return (
          <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
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