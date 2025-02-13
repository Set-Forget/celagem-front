'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListPurchaseReceiptsQuery } from "@/services/purchase-receipts";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

export default function PurchaseReceiptsPage() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: purchaseReceipts, isLoading } = useListPurchaseReceiptsQuery();

  return (
    <>
      <Header>
        <Button
          className="ml-auto"
          size="sm"
          asChild
        >
          <Link href="/purchases/purchase-receipts/new">
            <Plus className="w-4 h-4" />
            Crear recepción de compra
          </Link>
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
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