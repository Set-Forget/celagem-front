'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListBillsQuery } from "@/lib/services/bills";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function Page() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }
  const status = searchParams.get('status')
  const date_range = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }

  const { data: bills, isLoading } = useListBillsQuery({
    number: search.field === "number" ? search?.query : undefined,
    status: status ? JSON.parse(status).join(',') : undefined,
    supplier: search.field === "supplier" ? search?.query : undefined,
    date_start: date_range?.field === "date" ? date_range.from : undefined,
    date_end: date_range?.field === "date" ? date_range.to : undefined,
    due_date_start: date_range?.field === "due_date" ? date_range.from : undefined,
    due_date_end: date_range?.field === "due_date" ? date_range.to : undefined,
  }, { refetchOnMountOrArgChange: true })

  return (
    <div>
      <Header title="Facturas de compra">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Cargar factura
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={bills?.data || []}
          loading={isLoading}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </div>
  )
}