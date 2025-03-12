'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { Plus } from "lucide-react";
import { columns } from "./components/columns";
import NewCostCenterDialog from "./components/new-cost-center-dialog";
import { CostCenter } from "./schemas/cost-centers";
import { usePathname, useRouter } from "next/navigation";
import Toolbar from "./components/toolbar";

const data: CostCenter[] = [
  {
    "id": "3a5e0cfc-5d62-4a9b-a7f8-82f1b98fa89a",
    "name": "MAIN Argentina",
    "status": "active"
  },
  {
    "id": "4d29b26a-79e2-4cbf-a626-9530f508eb06",
    "name": "MAIN Colombia",
    "status": "inactive"
  },
]

export default function CostsCenterPage() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
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
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewCostCenterDialog />
    </>
  )
}