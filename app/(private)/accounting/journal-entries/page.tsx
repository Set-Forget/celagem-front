'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListJournalEntriesQuery } from "@/lib/services/journal-entries";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function Page() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const status = JSON.parse(searchParams.get('status') || 'null')
  const date_range = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }
  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: journalEntries, isLoading: isJournalEntriesLoading } = useListJournalEntriesQuery({
    number: search ? search.query : undefined,
    date_start: date_range?.field === "date" ? date_range.from : undefined,
    date_end: date_range?.field === "date" ? date_range.to : undefined,
    state: status ?? undefined,
  }, { refetchOnMountOrArgChange: true })

  return (
    <div>
      <Header title="Asientos contables">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear asiento
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={journalEntries?.data
            ?.toSorted((a, b) => b.id - a.id)
            ?? []}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
          loading={isJournalEntriesLoading}
        />
      </div>
    </div>
  )
}