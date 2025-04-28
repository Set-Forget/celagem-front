'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListPurchaseOrdersQuery } from "@/lib/services/purchase-orders";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function Page() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const status = searchParams.get('status')
  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }
  const date_range = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }

  const { data: purchaseOrders, isLoading } = useListPurchaseOrdersQuery({
    status: status ? JSON.parse(status).join(',') : undefined,
    number: search.field === "number" ? search?.query : undefined,
    supplier: search.field === "supplier" ? search?.query : undefined,
    created_at_start: date_range?.field === "created_at" ? date_range.from : undefined,
    created_at_end: date_range?.field === "created_at" ? date_range.to : undefined,
    required_date_start: date_range?.field === "required_date" ? date_range.from : undefined,
    required_date_end: date_range?.field === "required_date" ? date_range.to : undefined,
  }, { refetchOnMountOrArgChange: true })

  return (
    <div>
      <Header title="Órdenes de compra">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear orden de compra
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={purchaseOrders?.data ?? []}
          columns={columns}
          loading={isLoading}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </div>
  )
}