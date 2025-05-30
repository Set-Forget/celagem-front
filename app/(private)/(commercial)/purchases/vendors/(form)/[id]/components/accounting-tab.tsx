import { useGetSupplierQuery } from "@/lib/services/suppliers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { SupplierDetail } from "../../../schema/suppliers";
import RenderFields from "@/components/render-fields";

const fields: FieldDefinition<SupplierDetail>[] = [
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