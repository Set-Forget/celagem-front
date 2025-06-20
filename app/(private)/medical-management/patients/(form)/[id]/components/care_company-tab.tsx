import RenderFields from "@/components/render-fields";
import { useGetPatientQuery } from "@/lib/services/patients";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";

export default function CareCompanyTab() {
  const { id } = useParams<{ id: string }>();

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(id);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Empresa",
      placeholderLength: 14,
      render: (p) => p.care_company_plan.care_company.name || "No especificado",
    },
    {
      label: "Contrato",
      placeholderLength: 14,
      render: (p) => p.care_company_plan.contract_number || "No especificado",
    },
    {
      label: "Plan de cobertura",
      placeholderLength: 14,
      render: (p) => p.care_company_plan.coverage || "No especificado",
    }
  ]

  return (
    <RenderFields
      fields={fields}
      loading={isPatientLoading}
      data={patient}
    />
  );
}