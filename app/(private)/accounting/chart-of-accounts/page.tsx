'use client'

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useListAccountingAccountsQuery } from "@/lib/services/accounting-accounts";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { ChevronDown } from "lucide-react";
import NestedAccountTable from "./components/nested-account-table";
import NewAccountDialog from "./components/new-account-dialog";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams()

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }
  const accountType = JSON.parse(searchParams.get('account_type') || 'null')

  const { data: accounts, isLoading: isAccountsLoading } = useListAccountingAccountsQuery({
    name: search.field === "name" ? search?.query : undefined,
    account_type: accountType || undefined,
  }, { refetchOnMountOrArgChange: true })

  return (
    <div className="flex flex-col h-full">
      <Header title="Plan de cuentas">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="ml-auto" asChild>
            <Button size="sm">
              Crear
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                setDialogsState({
                  open: "new-account",
                })
              }}
            >
              Nueva cuenta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <div className="flex flex-col p-4 h-full justify-between">
        <NestedAccountTable data={accounts?.data} loading={isAccountsLoading} />
      </div>
      <NewAccountDialog />
    </div>
  )
}