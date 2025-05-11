import { useGetSupplierQuery } from "@/lib/services/suppliers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { SupplierDetail } from "../../../schema/suppliers";

const fields: FieldDefinition<SupplierDetail>[] = [
  {
    label: "Ciudad",
    placeholderLength: 16,
    getValue: (p) => p.city || "No especificado",
  },
  {
    label: "Calle",
    placeholderLength: 16,
    getValue: (p) => p.street || "No especificado",
  },
  {
    label: "Código postal",
    placeholderLength: 16,
    getValue: (p) => p.zip || "No especificado",
  },
  {
    label: "Telefono",
    placeholderLength: 16,
    getValue: (p) => p.phone || "No especificado",
  },
  {
    label: "Correo electrónico",
    placeholderLength: 16,
    getValue: (p) => p.email || "No especificado",
  },
  {
    label: "Página web",
    placeholderLength: 16,
    getValue: (p) => p.website || "No especificado",
  },
];

export default function ContactTab() {
  const { id } = useParams<{ id: string }>()

  const { data: supplier, isLoading: isSupplierLoading } = useGetSupplierQuery(id)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {fields.map((field) => {
        const displayValue = isSupplierLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(supplier!) ?? "";
        return (
          <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                isSupplierLoading ? "blur-[4px]" : "blur-none"
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