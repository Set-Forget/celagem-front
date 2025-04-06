'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Toolbar from "./components/toolbar"
import { columns } from "./components/columns"
import { useListPatientsQuery } from "@/lib/services/patients"

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: patients, isLoading: isPatientsLoading } = useListPatientsQuery()

  return (
    <div>
      <Header title="Pacientes">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear paciente
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={patients?.data || []}
          loading={isPatientsLoading}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={() => <Toolbar />}
        />
      </div>
    </div>
  )
}