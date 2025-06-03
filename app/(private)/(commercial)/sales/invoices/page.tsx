'use client'

import { DataTable } from "@/components/data-table";
import Dropdown from "@/components/dropdown";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";
import { useListInvoicesQuery } from "@/lib/services/invoices";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function Page() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }
  const status = JSON.parse(searchParams.get('status') || '[]').join(',') || []
  const type = JSON.parse(searchParams.get('type') || '[]').join(',') || []
  const date_range = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }

  const { data: invoices, isLoading: isInvoicesLoading } = useListInvoicesQuery({
    //number: search.field === "number" ? search?.query : undefined,
    //status: status ? JSON.parse(status).join(',') : undefined,
    date_start: date_range?.field === "date" ? date_range.from : undefined,
    date_end: date_range?.field === "date" ? date_range.to : undefined,
    due_date_start: date_range?.field === "due_date" ? date_range.from : undefined,
    due_date_end: date_range?.field === "due_date" ? date_range.to : undefined,
  }, { refetchOnMountOrArgChange: true })

  return (
    <div>
      <Header title="Comprobantes de venta">
        <Dropdown
          trigger={
            <Button
              className="ml-auto"
              size="sm"
            >
              Crear
              <ChevronDown />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => router.push(routes.invoice.new)}>
            Factura de venta
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(routes.salesCreditNote.new)}>
            Nota de crédito
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(routes.salesDebitNote.new)}>
            Nota de débito
          </DropdownMenuItem>
        </Dropdown>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)] [&_*[data-table='true']]:w-[calc(100svw-306px)]">
        <DataTable
          data={invoices
            ?.toSorted((a, b) => b.id - a.id)
            .filter(invoice => invoice.number.toString().toLowerCase().includes(search?.query?.toLowerCase() ?? ""))
            .filter(invoice => type.length === 0 || type.includes(invoice.type))
            .filter(invoice => status.length === 0 || status.includes(invoice.status)) ?? []}
          columns={columns}
          onRowClick={(row) => {
            if (row.type === "debit_note") return router.push(`debit-notes/${row.id}`)
            if (row.type === "credit_note") return router.push(`credit-notes/${row.id}`)
            return router.push(`${pathname}/${row.id}`)
          }}
          toolbar={({ table }) => <Toolbar table={table} />}
          loading={isInvoicesLoading}
        />
      </div>
    </div>
  )
}