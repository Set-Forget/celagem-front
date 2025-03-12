'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import { usePathname, useRouter } from "next/navigation";

const PATIENT_DATA = [
  {
    "id": "uuid1",
    "visit_number": 23,
    "date": "2024-03-25T14:15:00",
    "created_by": "admin",
    "speciality": "Psicología",
    "attention_type": "Gestante",
    "headquarter": "Sede Asistencial Bogotá"
  },
  {
    "id": "uuid2",
    "visit_number": 45,
    "date": "2023-10-20T11:30:00",
    "created_by": "doctor123",
    "speciality": "Enfermeria",
    "attention_type": "Aportante de semen",
    "headquarter": "Sede Asistencial Bogotá"
  },
  {
    "id": "uuid3",
    "visit_number": 89,
    "date": "2024-01-10T09:45:00",
    "created_by": "nurse2023",
    "speciality": "Ginecobstetra",
    "attention_type": "Ovo-aportante",
    "headquarter": "Sede Asistencial Bogotá"
  },
  {
    "id": "uuid4",
    "visit_number": 67,
    "date": "2023-07-05T08:20:00",
    "created_by": "assistant",
    "speciality": "Bacteriologia",
    "attention_type": "Gestante",
    "headquarter": "Sede Asistencial Bogotá"
  },
  {
    "id": "uuid5",
    "visit_number": 12,
    "date": "2023-11-15T16:00:00",
    "created_by": "coordinator",
    "speciality": "Nutrición",
    "attention_type": "Aportante de semen",
    "headquarter": "Sede Asistencial Bogotá"
  }
]

export default function MedicalRecords() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <>
      <Header title="Paciente Juan Pérez" />
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={PATIENT_DATA}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  )
}