import RenderFields from "@/components/render-fields";
import { useGetPatientQuery } from "@/lib/services/patients";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";

export default function CareCompanyTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

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