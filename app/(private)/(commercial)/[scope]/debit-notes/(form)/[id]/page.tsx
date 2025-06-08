'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import RenderFields from "@/components/render-fields"
import { Badge } from "@/components/ui/badge"
import { AdaptedDebitNoteDetail } from "@/lib/adapters/debit-notes"
import { useGetDebitNoteQuery } from "@/lib/services/debit-notes"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Paperclip } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import PartnerTab from "../../../credit-notes/(form)/[id]/components/partner-tab"
import { debitNoteStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import DocumentsTab from "./components/documents-tab"
import { TableFooter } from "@/app/(private)/(commercial)/components/table-footer"
import { DebitNoteLine } from "../../schemas/debit-notes"

const fields: FieldDefinition<AdaptedDebitNoteDetail>[] = [
  {
    label: "Número",
    placeholderLength: 14,
    show: (p) => !!p?.custom_sequence_number,
    render: (p) => p?.custom_sequence_number
  },
  {
    label: "Fecha de emisión",
    placeholderLength: 14,
    render: (p) => p.date ? format(parseISO(p.date), "PP", { locale: es }) : "No especificado",
  },
  {
    label: "Fecha de vencimiento",
    placeholderLength: 10,
    render: (p) => p.due_date ? format(parseISO(p.due_date), "PP", { locale: es }) : "No especificado",
  },
  {
    label: "Fecha de contabilización",
    placeholderLength: 14,
    render: (p) => p.accounting_date ? format(parseISO(p.accounting_date), "PP", { locale: es }) : "No especificado",
  },
  {
    label: "Condición de pago",
    placeholderLength: 10,
    render: (p) => p.payment_term?.name || "No especificado",
  },
  {
    label: "Método de pago",
    placeholderLength: 10,
    render: (p) => p.payment_method?.name || "No especificado",
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

  const { data: debitNote, isLoading: isDebitNoteLoading } = useGetDebitNoteQuery(id)

  const status = debitNoteStatus[debitNote?.status as keyof typeof debitNoteStatus];
  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isDebitNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isDebitNoteLoading ? placeholder(13, true) : debitNote?.number}
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
        <Actions state={debitNote?.status} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <RenderFields
          fields={fields}
          loading={isDebitNoteLoading}
          data={debitNote}
        />
        <DataTable
          data={debitNote?.items.map((item) => ({ ...item, currency: debitNote?.currency.name })) ?? []}
          loading={isDebitNoteLoading}
          columns={columns}
          pagination={false}
          footer={() =>
            <TableFooter<DebitNoteLine>
              items={debitNote?.items ?? []}
              colSpan={columns.length}
              selectors={{
                unitPrice: (item) => item.price_unit,
                quantity: (item) => item.quantity,
                currency: () => debitNote?.currency,
                taxes: (item) => item.taxes,
                pendingAmount: () => debitNote?.amount_residual ?? 0
              }}
            />}
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