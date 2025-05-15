'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { useGetAccountingAccountQuery, useListAccountingAccountMoveLinesQuery } from "@/lib/services/accounting-accounts"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { useParams } from "next/navigation"
import { accountTypes } from "../data"
import { AccountDetail } from "../schemas/account"
import { columns } from "./components/columns"
import Toolbar from "./components/toolbar"
import TableFooter from "./components/table-footer"

const fields: FieldDefinition<AccountDetail>[] = [
  {
    label: "Código",
    placeholderLength: 14,
    getValue: (p) => p?.code || 'No especificado',
  },
  {
    label: "Tipo de cuenta",
    placeholderLength: 14,
    getValue: (p) => accountTypes.find((type) => type.value === p.account_type)?.label || 'No especificado',
  },
  {
    label: "Compañía",
    placeholderLength: 14,
    getValue: (p) => p?.company?.name || 'No especificado',
  }
];

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const { data: account, isLoading: isAccountsLoading } = useGetAccountingAccountQuery(id)
  const { data: accountMoves, isLoading: isAccountMovesLoading } = useListAccountingAccountMoveLinesQuery(id)

  return (
    <div className="flex flex-col h-full">
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isAccountsLoading ? "blur-[4px]" : "blur-none")}>
          {isAccountsLoading ? placeholder(13, true) : account?.name}
        </h1>
      } />
      <div className="flex flex-col p-4 gap-4 flex-1 h-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isAccountsLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(account!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <label className="text-muted-foreground text-sm">
                  {field.label}
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isAccountsLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 h-full">
          <label className="text-muted-foreground text-sm">
            Movimientos
          </label>
          <DataTable
            data={accountMoves?.data ?? []}
            loading={isAccountMovesLoading}
            columns={columns}
            toolbar={({ table }) => <Toolbar table={table} />}
            footer={() => <TableFooter />}
            pagination={false}
          />
        </div>
      </div>
    </div>
  )
}
