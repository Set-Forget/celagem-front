'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListInvoicesQuery } from "@/lib/services/invoices";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function Page() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const status = searchParams.get('status')
  const date_range = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }
  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: invoices, isLoading: isInvoicesLoading } = useListInvoicesQuery({
    number: search ? search.query : undefined,
    date_start: date_range?.field === "date" ? date_range.from : undefined,
    date_end: date_range?.field === "date" ? date_range.to : undefined,
    due_date_start: date_range?.field === "due_date" ? date_range.from : undefined,
    due_date_end: date_range?.field === "due_date" ? date_range.to : undefined,
  }, { refetchOnMountOrArgChange: true })

  return (
    <div>
      <Header title="Facturas de venta">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear factura
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)] [&_*[data-table='true']]:w-[calc(100svw-306px)]">
        <DataTable
          data={invoices?.data || []}
          columns={columns}
          onRowClick={(row) => {
            if (row.type === "debit_note") return router.push(`${pathname.replace(/^\/sales\/invoices/, "")}/debit-notes/${row.id}`)
            if (row.type === "credit_note") return router.push(`${pathname.replace(/^\/sales\/invoices/, "")}/credit-notes/${row.id}`)
            return router.push(`${pathname}/${row.id}`)
          }}
          toolbar={({ table }) => <Toolbar table={table} />}
          loading={isInvoicesLoading}
        />
      </div>
    </div>
  )
}