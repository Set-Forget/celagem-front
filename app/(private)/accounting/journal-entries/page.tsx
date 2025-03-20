'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import { JournalEntry } from "./schemas/journal-entries";

const data: JournalEntry[] = [
  {
    "id": "f1e27d18-4fa9-4811-926b-244ae913d8de",
    "title": "Compra de muebles de oficina",
    "account": "Insumos de oficina",
    "amount": 4152.73,
    "date": "2024-02-15",
  },
  {
    "id": "7f38b02b-2430-4428-83bb-e357eb1f8898",
    "title": "Pago de servicios de limpieza",
    "account": "Caja",
    "amount": 1623.91,
    "date": "2024-03-23",
  },
]

export default function JournalEntriesPage() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <Header title="Asientos contables">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Cargar asiento
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  )
}