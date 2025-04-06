'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListInvoicesQuery } from "@/lib/services/invoices";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: invoices, isLoading: isInvoicesLoading } = useListInvoicesQuery()

  return (
    <div>
      <Header>
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear factura
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={invoices?.data || []}
          columns={columns}
          onRowClick={(row) => {
            if (row.type === "debit_note") return router.push(`${pathname.replace("invoices", "debit-notes")}/${row.id}`)
            if (row.type === "credit_note") return router.push(`${pathname.replace("invoices", "credit-notes")}/${row.id}`)
            return router.push(`${pathname}/${row.id}`)
          }}
          toolbar={({ table }) => <Toolbar table={table} />}
          loading={isInvoicesLoading}
        />
      </div>
    </div>
  )
}