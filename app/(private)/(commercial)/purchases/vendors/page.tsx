'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListSuppliersQuery } from "@/lib/services/suppliers";
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

  const { data: suppliers, isLoading: isSuppliersLoading } = useListSuppliersQuery({
    name: search.field === "supplier" ? search?.query : undefined,
    tax_id: search.field === "tax_id" ? search?.query : undefined,
    status: status === "true" ? true : status === "false" ? false : undefined,
  }, { refetchOnMountOrArgChange: true })

  return (
    <div>
      <Header title="Proveedores">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear proveedor
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={suppliers?.data || []}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
          loading={isSuppliersLoading}
        />
      </div>
    </div>
  )
}