import { useGetSupplierQuery } from "@/lib/services/suppliers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { SupplierDetail } from "../../../schema/suppliers";
import RenderFields from "@/components/render-fields";

const fields: FieldDefinition<SupplierDetail>[] = [
  {
    label: "Creado por",
    placeholderLength: 16,
    render: (p) => p.created_by?.name || "No especificado",
  },
  {
    label: "Fecha de creación",
    placeholderLength: 16,
    render: (p) => p.created_at ? new Date(p.created_at).toLocaleDateString() : "No especificado",
  }
];

export default function TraceabilityTab() {
  const { id } = useParams<{ id: string }>()

  const { data: supplier, isLoading: isSupplierLoading } = useGetSupplierQuery(id)

  return (
    <RenderFields
      fields={fields}
      data={supplier}
      loading={isSupplierLoading}
      className="p-4"
    />
  )
}