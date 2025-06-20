import RenderFields from "@/components/render-fields";
import { useGetPatientQuery } from "@/lib/services/patients";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";
import { documentTypes } from "../../../utils";

export default function CaregiverTab() {
  const { id } = useParams<{ id: string }>();

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(id);

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