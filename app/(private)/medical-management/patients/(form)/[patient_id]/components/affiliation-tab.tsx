import RenderFields from "@/components/render-fields";
import { useGetPatientQuery } from "@/lib/services/patients";
import { FieldDefinition } from "@/lib/utils";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";
import { linkageTypes } from "../../../utils";

export default function AffiliationTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Clase",
      placeholderLength: 14,
      render: (p) => p.class?.name,
    },
    {
      label: "Compañia",
      placeholderLength: 14,
      render: (p) => p.company.name,
    },
    {
      label: "Aseguradora",
      placeholderLength: 14,
      render: (p) => p.insurance_provider || "No especificado",
    },
    {
      label: "Sedes",
      placeholderLength: 14,
      render: (p) => p.clinics.map((c) => c.name).join(", "),
    },
    {
      label: "Entidad/IPS remitente",
      placeholderLength: 14,
      render: (p) => p.referring_entity || "No especificado",
    },
    {
      label: "Tipo de vinculación",
      placeholderLength: 14,
      render: (p) =>
        linkageTypes.find((l) => l.value === p.linkage)?.label || "No especificado",
    },
  ];

  return (
    <RenderFields
      fields={fields}
      loading={isPatientLoading}
      data={patient}
    />
  )
}