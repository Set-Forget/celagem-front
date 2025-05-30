import { useGetSupplierQuery } from "@/lib/services/suppliers";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { SupplierDetail } from "../../../schema/suppliers";
import { entity_type, fiscal_responsibility, nationality_type, tax_category, tax_information, tax_regime, tax_type } from "../../new/data";
import RenderFields from "@/components/render-fields";

const fields: FieldDefinition<SupplierDetail>[] = [
  {
    label: "Tipo de documento",
    placeholderLength: 16,
    render: (p) => tax_type.find((type) => type.value === p.tax_type)?.label || "No especificado",
  },
  {
    label: "Número de identificación fiscal",
    placeholderLength: 16,
    render: (p) => p.tax_id || "No especificado",
  },
  {
    label: "Regimen tributario",
    placeholderLength: 16,
    render: (p) => tax_regime.find((regime) => regime.value === p.tax_regime)?.label || "No especificado",
  },
  {
    label: "Actividad económica",
    placeholderLength: 16,
    render: (p) => p.economic_activity?.name || "No especificado",
  },
  {
    label: "Tipo de entidad",
    placeholderLength: 16,
    render: (p) => entity_type.find((type) => type.value === p.entity_type)?.label || "No especificado",
  },
  {
    label: "Tipo de nacionalidad",
    placeholderLength: 16,
    render: (p) => nationality_type.find((type) => type.value === p.nationality_type)?.label || "No especificado",
  },
  {
    label: "Regimen fiscal",
    placeholderLength: 16,
    render: (p) => tax_category.find((category) => category.value === p.tax_category)?.label || "No especificado",
  },
  {
    label: "¿Es residente?",
    placeholderLength: 16,
    render: (p) => p.is_resident ? "Sí" : "No",
  },
  {
    label: "Información tributaria",
    placeholderLength: 16,
    render: (p) => tax_information.find((info) => info.value === p.tax_information)?.label || "No especificado",
  },
  {
    label: "Responsabilidad fiscal",
    placeholderLength: 16,
    render: (p) => fiscal_responsibility.find((responsibility) => responsibility.value === p.fiscal_responsibility)?.label || "No especificado",
  }
];

export default function FiscalTab() {
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