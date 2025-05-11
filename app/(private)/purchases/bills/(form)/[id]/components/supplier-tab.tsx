import { useGetBillQuery } from "@/lib/services/bills";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { BillDetail } from "../../../schemas/bills";

const fields: FieldDefinition<BillDetail>[] = [
  {
    label: "Proveedor",
    placeholderLength: 14,
    getValue: (p) => p.supplier.name || "No especificado",
  },
  {
    label: "Número de teléfono",
    placeholderLength: 13,
    getValue: (p) => p.supplier.phone || "No especificado",
  },
  {
    label: "Correo electrónico",
    placeholderLength: 10,
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

  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(id);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isBillLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(bill!) ?? "";
        return (
          <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                isBillLoading ? "blur-[4px]" : "blur-none"
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