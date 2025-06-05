'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import RenderFields from "@/components/render-fields"
import { Badge } from "@/components/ui/badge"
import { useGetCreditNoteQuery } from "@/lib/services/credit-notes"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Paperclip } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { CreditNoteDetail } from "../../schemas/credit-notes"
import { creditNoteStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import DocumentsTab from "./components/documents-tab"
import PartnerTab from "./components/partner-tab"
import TableFooter from "./components/table-footer"
import { AdaptedCreditNoteDetail } from "@/lib/adapters/credit-notes"

const fields: FieldDefinition<AdaptedCreditNoteDetail>[] = [
  {
    label: "Número",
    placeholderLength: 14,
    show: (p) => !!p?.custom_sequence_number,
    render: (p) => p?.custom_sequence_number,
  },
  {
    label: "Fecha de emisión",
    placeholderLength: 14,
    render: (p) => p.date ? format(parseISO(p.date), "PP", { locale: es }) : "No especificado",
  },
  {
    label: "Fecha de contabilización",
    placeholderLength: 14,
    render: (p) => p.accounting_date ? format(parseISO(p.accounting_date), "PP", { locale: es }) : "No especificado",
  },
  {
    label: "Notas",
    placeholderLength: 20,
    render: (p) => p.internal_notes || "No hay notas",
    className: "col-span-2"
  }
];

export default function Page() {
  const { id, scope } = useParams<{ id: string, scope: "sales" | "purchases" }>()

  const tabs = [
    {
      value: "tab-2",
      label: scope === "sales" ? "Cliente" : "Proveedor",
      icon: <Box size={16} />,
      content: <PartnerTab />
    },
    {
      value: "tab-3",
      label: "Documentos",
      icon: <Paperclip size={16} />,
      content: <DocumentsTab />
    }
  ]

  const [tab, setTab] = useState(tabs[0].value)

  const { data: creditNote, isLoading: isCreditNoteLoading } = useGetCreditNoteQuery(id)

  const status = creditNoteStatus[creditNote?.status as keyof typeof creditNoteStatus];

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isCreditNoteLoading ? placeholder(13, true) : creditNote?.number}
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
        <Actions state={creditNote?.status} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <RenderFields
          fields={fields}
          loading={isCreditNoteLoading}
          data={creditNote}
        />
        <DataTable
          data={creditNote?.items.map((item) => ({ ...item, currency: creditNote?.currency.name })) ?? []}
          loading={isCreditNoteLoading}
          columns={columns}
          pagination={false}
          footer={() => <TableFooter />}
        />
      </div>
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4"
      />
    </div>
  )
}