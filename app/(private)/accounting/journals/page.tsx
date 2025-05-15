'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListJournalsQuery } from "@/lib/services/journals";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import { setDialogsState } from "@/lib/store/dialogs-store";
import NewJournalDialog from "./components/new-journal-dialog";

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: journals, isLoading: isJournalsLoading } = useListJournalsQuery();

  return (
    <div>
      <Header title="Diarios contables">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => {
            setDialogsState({
              open: "new-journal",
            })
          }}
        >
          <Plus className="w-4 h-4" />
          Crear diario
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={journals?.data ?? []}
          columns={columns}
          toolbar={({ table }) => <Toolbar table={table} />}
          loading={isJournalsLoading}
        />
      </div>
      <NewJournalDialog />
    </div>
  )
}