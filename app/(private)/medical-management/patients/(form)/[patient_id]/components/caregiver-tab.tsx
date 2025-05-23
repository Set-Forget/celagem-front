import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";
import { documentTypes } from "../../../utils";
import RenderFields from "@/components/render-fields";

export default function CaregiverTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Nombre",
      placeholderLength: 14,
      render: (p) => p.caregiver?.name,
    },
    {
      label: "Tipo de documento",
      placeholderLength: 14,
      render: (p) =>
        documentTypes.find((d) => d.value === p.document_type)?.label || "No aplica",
    },
    {
      label: "Número de documento",
      placeholderLength: 14,
      render: (p) => p.caregiver?.document_number || "No especificado",
    },
    {
      label: "Número de teléfono",
      placeholderLength: 14,
      render: (p) => p.caregiver?.phone_number || "No especificado",
    },
    {
      label: "Parentesco",
      placeholderLength: 14,
      render: (p) => p.caregiver?.relationship || "No especificado",
    },
    {
      label: "Dirección",
      placeholderLength: 30,
      render: (p) => p.caregiver?.address.formatted_address || "No especificado",
      className: "col-span-2",
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