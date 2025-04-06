'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { Plus } from "lucide-react";
import { columns } from "./components/columns";
import NewCostCenterDialog from "./components/new-cost-center-dialog";
import { usePathname, useRouter } from "next/navigation";
import Toolbar from "./components/toolbar";
import { useListCostCentersQuery } from "@/lib/services/cost-centers";

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: costCenters, isLoading: isCostCentersLoading } = useListCostCentersQuery()

  return (
    <div>
      <Header title="Centro de costos">
        <Button
          size="sm"
          className="ml-auto"
          onClick={() => {
            setDialogsState({
              open: "new-cost-center",
            })
          }}
        >
          <Plus className="w-4 h-4" />
          Crear centro de costos
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={costCenters?.data || []}
          loading={isCostCentersLoading}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewCostCenterDialog />
    </div>
  )
}