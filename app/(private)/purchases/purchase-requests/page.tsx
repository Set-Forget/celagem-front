'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListPurchaseRequestsQuery } from "@/lib/services/purchase-requests";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function PurchaseRequestsPage() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: purchaseRequests, isLoading } = useListPurchaseRequestsQuery();

  return (
    <>
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
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={purchaseRequests?.data ?? []}
          loading={isLoading}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  )
}