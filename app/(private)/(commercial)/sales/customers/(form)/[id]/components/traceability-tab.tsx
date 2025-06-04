import RenderFields from "@/components/render-fields";
import { useGetCustomerQuery } from "@/lib/services/customers";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { CustomerDetail } from "../../../schema/customers";

const fields: FieldDefinition<CustomerDetail>[] = [
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