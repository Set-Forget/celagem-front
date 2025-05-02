'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListTemplatesQuery } from "@/lib/services/templates";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import NewTemplateDialog from "./components/new-template-dialog";
import { setDialogsState } from "@/lib/store/dialogs-store";

export default function Page() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: templates, isLoading: isTemplatesLoading } = useListTemplatesQuery({
    name: search.field === "name" ? search?.query.trim() : undefined,
  }, { refetchOnMountOrArgChange: true })

  return (
    <div>
      <Header title="Plantillas">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({ open: "new-template" })}
        >
          <Plus
            className="w-4 h-4"
          />
          Nueva plantilla
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={templates?.data ?? []}
          columns={columns}
          loading={isTemplatesLoading}
          toolbar={({ table }) => <Toolbar table={table} />}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
        />
      </div>
      <NewTemplateDialog />
    </div>
  )
}