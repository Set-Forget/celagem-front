'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListPurchaseReceiptsQuery } from "@/lib/services/purchase-receipts";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: purchaseReceipts, isLoading } = useListPurchaseReceiptsQuery();

  return (
    <>
      <Header>
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear recepción de compra
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={purchaseReceipts?.data ?? []}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
          loading={isLoading}
        />
      </div>
    </>
  )
}