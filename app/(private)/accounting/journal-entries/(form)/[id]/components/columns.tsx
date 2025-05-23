"use client"

import {
  ColumnDef,
  Row
} from "@tanstack/react-table"
import { JournalEntryItem } from "../../../schemas/journal-entries"
import { useGetJournalEntryQuery } from "@/lib/services/journal-entries"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { routes } from "@/lib/routes"

const DebitCell = ({ row }: { row: Row<JournalEntryItem> }) => {
  const { id } = useParams<{ id: string }>()
  const { data: journalEntry } = useGetJournalEntryQuery(id)

  return (
    <div>
      {journalEntry?.currency.name}{" "}
      {row.getValue("debit")}
    </div>
  )
}

const CreditCell = ({ row }: { row: Row<JournalEntryItem> }) => {
  const { id } = useParams<{ id: string }>()
  const { data: journalEntry } = useGetJournalEntryQuery(id)

  return (
    <div>
      {journalEntry?.currency.name}{" "}
      {row.getValue("credit")}
    </div>
  )
}

export const columns: ColumnDef<JournalEntryItem>[] = [
  {
    accessorKey: "account_name",
    header: "Cuenta contable",
    cell: ({ row }) => {
      return <Button
        variant="link"
        className="p-0 h-auto text-foreground"
        asChild
      >
        <Link href={routes.chartOfAccounts.detail(row.original.account_id)} target="_blank">
          {row.getValue("account_name")}
        </Link>
      </Button>
    },
  },
  {
    accessorKey: "name",
    header: "Ref. / Descripción",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "debit",
    header: "Debe",
    cell: ({ row }) => <DebitCell row={row} />,
  },
  {
    accessorKey: "credit",
    header: "Haber",
    cell: ({ row }) => <CreditCell row={row} />,
  },
]