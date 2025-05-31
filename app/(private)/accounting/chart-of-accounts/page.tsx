'use client'

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useListAccountingAccountsQuery } from "@/lib/services/accounting-accounts";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import NestedAccountTable from "./components/nested-account-table";
import NewAccountDialog from "./components/new-account-dialog";

export default function Page() {
  const searchParams = useSearchParams()

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }
  const accountType = JSON.parse(searchParams.get('account_type') || 'null')

  const { data: accounts, isLoading: isAccountsLoading } = useListAccountingAccountsQuery({
    //name: search.field === "name" ? search?.query : undefined,
    account_type: accountType || undefined,
    parent: String(0)
  }, { refetchOnMountOrArgChange: true })

  const nameQuery = search.field === "name" ? search?.query : undefined
  const codeQuery = search.field === "code" ? search?.query : undefined

  return (
    <div className="flex flex-col h-full">
      <Header title="Plan de cuentas">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({
            open: "new-account",
          })}
        >
          <Plus />
          Crear cuenta
        </Button>
      </Header>
      <div className="flex flex-col p-4 h-full justify-between">
        <NestedAccountTable
          data={accounts?.data.filter(acc =>
            (!nameQuery || acc.name.toLowerCase().includes(nameQuery.toLowerCase())) &&
            (!codeQuery || acc.code.toLowerCase().includes(codeQuery.toLowerCase()))
          ) ?? []}
          loading={isAccountsLoading}
        />
      </div>
      <NewAccountDialog />
    </div>
  )
}