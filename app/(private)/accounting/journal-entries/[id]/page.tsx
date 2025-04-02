'use client'

import { DataTable } from "@/components/data-table"
import Dropdown from "@/components/dropdown"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { useGetJournalEntryQuery } from "@/lib/services/journal-entries"
import { cn, placeholder } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Ellipsis } from "lucide-react"
import { useParams } from "next/navigation"
import { JournalEntryDetail } from "../schemas/journal-entries"
import { columns } from "./components/columns"
import TableFooter from "./components/table-footer"
import Actions from "./actions"
import { Badge } from "@/components/ui/badge"
import { journalEntryStatus } from "../utils"

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<JournalEntryDetail>[] = [
  {
    label: "Fecha de creación",
    placeholderLength: 14,
    getValue: (p) => format(p.date, "PPP", { locale: es })
  },
  {
    label: "Diario contable",
    placeholderLength: 10,
    getValue: (p) => p.journal.name
  },
  {
    label: "Notas",
    placeholderLength: 30,
    getValue: (p) => p.internal_notes || "No hay notas",
    className: "col-span-2"
  }
];

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const { data: journalEntry, isLoading: isJournalEntryLoading } = useGetJournalEntryQuery(id)

  const status = journalEntryStatus[journalEntry?.status as keyof typeof journalEntryStatus];

  return (
    <>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isJournalEntryLoading ? "blur-[4px]" : "blur-none")}>
          {isJournalEntryLoading ? placeholder(20, true) : journalEntry?.number}
        </h1>
      }>
        <div className="mr-auto">
          <Badge
            variant="custom"
            className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
          >
            {status?.label}
          </Badge>
        </div>
        <Actions state={journalEntry?.status} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-base font-medium">General</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isJournalEntryLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(journalEntry!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <label className="text-muted-foreground text-sm">
                  {field.label}
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isJournalEntryLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
        <DataTable
          data={journalEntry?.items || []}
          footer={() => <TableFooter />}
          loading={isJournalEntryLoading}
          columns={columns}
          pagination={false}
        />
      </div>
    </>
  )
}
