'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { useGetJournalEntryQuery } from "@/lib/services/journal-entries"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { useParams } from "next/navigation"
import { JournalEntryDetail } from "../../schemas/journal-entries"
import { journalEntryStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import TableFooter from "./components/table-footer"
import RenderFields from "@/components/render-fields"

const fields: FieldDefinition<JournalEntryDetail>[] = [
  {
    label: "Fecha de creación",
    placeholderLength: 14,
    render: (p) => format(parseISO(p.date), "PP", { locale: es })
  },
  {
    label: "Diario contable",
    placeholderLength: 10,
    render: (p) => p.journal.name
  },
  {
    label: "Notas",
    placeholderLength: 30,
    render: (p) => p.internal_notes || "No hay notas",
    className: "col-span-2"
  }
];

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const { data: journalEntry, isLoading: isJournalEntryLoading } = useGetJournalEntryQuery(id)

  const status = journalEntryStatus[journalEntry?.status as keyof typeof journalEntryStatus];

  return (
    <div>
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
        <RenderFields
          fields={fields}
          data={journalEntry}
          loading={isJournalEntryLoading}
        />
        <DataTable
          data={journalEntry?.items || []}
          footer={() => <TableFooter />}
          loading={isJournalEntryLoading}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  )
}
