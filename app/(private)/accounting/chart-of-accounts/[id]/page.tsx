'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { useGetAccountingAccountQuery, useListAccountingAccountMoveLinesQuery } from "@/lib/services/accounting-accounts"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { useParams, useSearchParams } from "next/navigation"
import { accountTypes } from "../data"
import { AccountDetail } from "../schemas/account"
import { columns } from "./components/columns"
import Toolbar from "./components/toolbar"
import TableFooter from "./components/table-footer"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { setDialogsState } from "@/lib/store/dialogs-store"
import EditAccountDialog from "../components/edit-account-dialog"
import RenderFields from "@/components/render-fields"

const fields: FieldDefinition<AccountDetail>[] = [
  {
    label: "Código",
    placeholderLength: 14,
    render: (p) => p?.code || 'No especificado',
  },
  {
    label: "Tipo de cuenta",
    placeholderLength: 14,
    render: (p) => accountTypes.find((type) => type.value === p.account_type)?.label || 'No especificado',
  },
  {
    label: "Compañía",
    placeholderLength: 14,
    render: (p) => p?.company?.name || 'No especificado',
  }
];

export default function Page() {
  const searchParams = useSearchParams()

  const { id } = useParams<{ id: string }>()

  const date_range = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }
  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: account, isLoading: isAccountsLoading } = useGetAccountingAccountQuery(id)
  const { data: accountMoves, isLoading: isAccountMovesLoading } = useListAccountingAccountMoveLinesQuery(id)

  const dateStart = date_range.field === "date" ? date_range.from.slice(0, 10) : undefined;
  const dateEnd = date_range.field === "date" ? date_range.to.slice(0, 10) : undefined;
  const moveSearch = search.field === "move_id" ? search?.query : undefined;
  const movePartner = search.field === "partner" ? search?.query : undefined;

  return (
    <div className="flex flex-col h-full">
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isAccountsLoading ? "blur-[4px]" : "blur-none")}>
          {isAccountsLoading ? placeholder(13, true) : account?.name}
        </h1>
      } >
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({ open: "edit-account", payload: { id } })}
        >
          <Edit />
          Editar
        </Button>
      </Header>
      <div className="flex flex-col p-4 gap-4 flex-1 h-full">
        <RenderFields
          fields={fields}
          loading={isAccountsLoading}
          data={account}
        />
        <div className="flex flex-col gap-2 h-full">
          <label className="text-muted-foreground text-sm">
            Movimientos
          </label>
          <div className="flex flex-col gap-4 [&_*[data-table='true']]:h-[calc(100svh-358px)] [&_*[data-table='true']]:w-[calc(100svw-306px)]">
            <DataTable
              data={accountMoves?.data
                ?.toSorted((a, b) => b.id - a.id)
                .filter(move => {
                  if (!dateStart && !dateEnd) return true;
                  const d = new Date(move.date);
                  return ((!dateStart || d >= new Date(dateStart)) && (!dateEnd || d <= new Date(dateEnd)));
                })
                .filter(move => moveSearch ? move.move_id.sequence_id.toString().includes(moveSearch) : true)
                .filter(move => movePartner ? move.partner?.name.toLowerCase().includes(movePartner.toLowerCase()) : true)
                ?? []}
              loading={isAccountMovesLoading}
              columns={columns}
              toolbar={({ table }) => <Toolbar table={table} />}
              footer={() => !isAccountMovesLoading && <TableFooter />}
            />
          </div>
        </div>
      </div>
      <EditAccountDialog />
    </div>
  )
}
