import RenderFields from "@/components/render-fields";
import { useGetPatientQuery } from "@/lib/services/patients";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";
import { customerTypes, fiscalCategories } from "../../../utils";

export default function FiscalTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Tipo de cliente",
      placeholderLength: 14,
      render: (p) =>
        customerTypes.find((type) => type.value === p.fiscal?.customer_type)?.label || "No aplica",
    },
    {
      label: "Razón social",
      placeholderLength: 14,
      render: (p) => p.fiscal?.registered_name || 'No aplica',
    },
    {
      label: "Número de identificación fiscal",
      placeholderLength: 14,
      render: (p) => p.fiscal?.tax_id,
    },
    {
      label: "Condición frente al IVA",
      placeholderLength: 14,
      render: (p) =>
        fiscalCategories.find((category) => category.value === p.fiscal?.fiscal_category)?.label || "No aplica",
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