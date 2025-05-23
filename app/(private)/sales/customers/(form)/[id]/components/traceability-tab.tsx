import { useGetCustomerQuery } from "@/lib/services/customers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { CustomerDetail } from "../../../schema/customers";
import RenderFields from "@/components/render-fields";

const fields: FieldDefinition<CustomerDetail>[] = [
  {
    label: "Creado por",
    placeholderLength: 16,
    render: (p) => p.traceability.created_by || "No especificado",
  },
  {
    label: "Fecha de creación",
    placeholderLength: 16,
    render: (p) => p.traceability.created_at ? new Date(p.traceability.created_at).toLocaleDateString() : "No especificado",
  },
  {
    label: "Actualizado por",
    placeholderLength: 16,
    render: (p) => p.traceability.updated_by || "No especificado",
  },
  {
    label: "Fecha de actualización",
    placeholderLength: 16,
    render: (p) => p.traceability.updated_at ? new Date(p.traceability.updated_at).toLocaleDateString() : "No especificado",
  }
];

export default function TraceabilityTab() {
  const { id } = useParams<{ id: string }>()

  const { data: customer, isLoading: isCustomerLoading } = useGetCustomerQuery(id)

  return (
    <RenderFields
      fields={fields}
      data={customer}
      loading={isCustomerLoading}
      className="p-4"
    />
  )
}