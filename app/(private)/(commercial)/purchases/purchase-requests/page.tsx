'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListPurchaseRequestsQuery } from "@/lib/services/purchase-requests";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function Page() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const status = JSON.parse(searchParams.get('status') || '[]').join(',') || []
  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }
  const date_range = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }

  const { data: purchaseRequests, isLoading } = useListPurchaseRequestsQuery({
    //status: status ? JSON.parse(status).join(',') : undefined,
    name: search.field === "name" ? search?.query : undefined,
    //request_date_start: date_range?.field === "request_date" ? date_range.from : undefined,
    //request_date_end: date_range?.field === "request_date" ? date_range.to : undefined,
  })

  const requestDateStart = date_range.field === "request_date" ? date_range.from.slice(0, 10) : undefined;
  const requestDateEnd = date_range.field === "request_date" ? date_range.to.slice(0, 10) : undefined;

  return (
    <div>
      <Header title="Solicitudes de pedido">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear solicitud de pedido
        </Button>
      </Header>
      <div className={cn("flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]", "[&_*[data-table='true']]:w-[calc(100svw-306px)]")}>
        <DataTable
          data={purchaseRequests?.data
            ?.toSorted((a, b) => b.id - a.id)
            .filter(purchaseRequest => status.length === 0 || status.includes(purchaseRequest.state))
            .filter(purchaseRequest => {
              if (!requestDateStart && !requestDateEnd) return true;
              const d = new Date(purchaseRequest.request_date).getTime();
              return (
                (!requestDateStart || d >= new Date(requestDateStart).getTime()) &&
                (!requestDateEnd || d <= new Date(requestDateEnd).getTime())
              );
            })
            ?? []}
          loading={isLoading}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </div>
  )
}