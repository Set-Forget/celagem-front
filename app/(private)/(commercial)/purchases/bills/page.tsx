'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListBillsQuery } from "@/lib/services/bills";
import { ChevronDown, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import Dropdown from "@/components/dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";

export default function Page() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }
  const status = JSON.parse(searchParams.get('status') || '[]').join(',') || []
  const type = JSON.parse(searchParams.get('type') || '[]').join(',') || []
  const date_range = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }

  const { data: bills, isLoading: isBillsLoading } = useListBillsQuery({
    number: search.field === "number" ? search?.query : undefined,
    //status: status ? JSON.parse(status).join(',') : undefined,
    supplier: search.field === "supplier" ? search?.query : undefined,
    date_start: date_range?.field === "date" ? date_range.from : undefined,
    date_end: date_range?.field === "date" ? date_range.to : undefined,
    due_date_start: date_range?.field === "due_date" ? date_range.from : undefined,
    due_date_end: date_range?.field === "due_date" ? date_range.to : undefined,
  }, { refetchOnMountOrArgChange: true })

  return (
    <div>
      <Header title="Comprobantes de compra">
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
          <DropdownMenuItem onSelect={() => router.push(routes.bill.new)}>
            Factura de compra
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(routes.purchaseCreditNote.new)}>
            Nota de crédito
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(routes.purchaseDebitNote.new)}>
            Nota de débito
          </DropdownMenuItem>
        </Dropdown>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)] [&_*[data-table='true']]:w-[calc(100svw-306px)]">
        <DataTable
          data={bills
            ?.toSorted((a, b) => b.id - a.id)
            .filter(bill => type.length === 0 || type.includes(bill.type))
            .filter(bill => status.length === 0 || status.includes(bill.status)) ?? []}
          loading={isBillsLoading}
          columns={columns}
          onRowClick={(row) => {
            if (row.type === "debit_note") return router.push(`debit-notes/${row.id}`)
            if (row.type === "credit_note") return router.push(`credit-notes/${row.id}`)
            return router.push(`${pathname}/${row.id}`)
          }}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </div>
  )
}