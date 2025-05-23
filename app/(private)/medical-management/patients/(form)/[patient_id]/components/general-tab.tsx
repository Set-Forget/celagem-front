import { useGetPatientQuery } from "@/lib/services/patients";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";
import { PatientDetail } from "../../../schema/patients";
import {
  biologicalSexTypes,
  disabilityTypes,
  documentTypes,
  genderIdentityTypes,
  linkageTypes,
  maritalStatusTypes
} from "../../../utils";
import RenderFields from "@/components/render-fields";

export default function GeneralTab() {
  const params = useParams<{ patient_id: string }>();
  const patientId = params.patient_id;

  const { data: patient, isLoading: isPatientLoading } = useGetPatientQuery(patientId);

  const fields: FieldDefinition<PatientDetail>[] = [
    {
      label: "Nombre",
      placeholderLength: 14,
      render: (p) => p.first_name + " " + p.first_last_name,
    },
    {
      label: "Número de documento",
      placeholderLength: 14,
      render: (p) => `${documentTypes.find((d) => d.value === p.document_type)?.short || ""} ${p.document_number}`,
    },
    {
      label: "Sexo biológico",
      placeholderLength: 14,
      render: (p) =>
        biologicalSexTypes.find((b) => b.value === p.biological_sex)?.label || "No especificado",
    },
    {
      label: "Identidad de género",
      placeholderLength: 14,
      render: (p) =>
        genderIdentityTypes.find((g) => g.value === p.gender_identity)?.label || "No especificado",
    },
    {
      label: "Fecha de nacimiento",
      placeholderLength: 13,
      render: (p) => p.birth_date ? format(p.birth_date, "PP", { locale: es }) : 'No especificado',
    },
    {
      label: "Lugar de nacimiento",
      placeholderLength: 14,
      render: (p) => p.birth_place?.formatted_address,
    },
    {
      label: "Estado civil",
      placeholderLength: 14,
      render: (p) =>
        maritalStatusTypes.find((m) => m.value === p.marital_status)?.label || "No especificado",
    },
    {
      label: "Discapacidad",
      placeholderLength: 14,
      render: (p) =>
        disabilityTypes.find((d) => d.value === p.disability_type)?.label || "No especificado",
    },
    {
      label: "Nombre del padre",
      placeholderLength: 14,
      render: (p) => p.father_name || "No especificado",
    },
    {
      label: "Nombre de la madre",
      placeholderLength: 14,
      render: (p) => p.mother_name || "No especificado",
    },
  ];

  return (
    <RenderFields
      fields={fields}
      loading={isPatientLoading}
      data={patient}
      className="p-4"
    />
  );
}
