import RenderFields from "@/components/render-fields";
import { useGetCustomerQuery } from "@/lib/services/customers";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { CustomerDetail } from "../../../schema/customers";

const fields: FieldDefinition<CustomerDetail>[] = [
  {
    label: "Moneda",
    placeholderLength: 16,
    render: (p) => p.currency?.name || "No especificado",
  },
  {
    label: "Condición de pago",
    placeholderLength: 16,
    render: (p) => p.property_payment_term?.name || "No especificado",
  },
  {
    label: "Método de pago",
    placeholderLength: 16,
    render: (p) => p.payment_method?.name || "No especificado",
  },
  {
    label: "Cuenta contable",
    placeholderLength: 16,
    render: (p) => p.account?.name || "No especificado",
  }
];

export default function AccountingTab() {
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