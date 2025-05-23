'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Receipt } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import Actions from "./actions"
import { columns } from "./components/columns"
import PartnerTab from "./components/partner-tab"
import InvoiceTab from "./components/invoice-tab"
import TableFooter from "./components/table-footer"
import { CreditNoteDetail } from "../../schemas/credit-notes"
import { useGetCreditNoteQuery } from "@/lib/services/credit-notes"
import { creditNoteStatus } from "../../utils"
import RenderFields from "@/components/render-fields"

const fields: FieldDefinition<CreditNoteDetail>[] = [
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
      value: "tab-1",
      label: "Factura",
      icon: <Receipt className="mr-1.5" size={16} />,
      content: <InvoiceTab />
    },
    {
      value: "tab-2",
      label: scope === "sales" ? "Cliente" : "Proveedor",
      icon: <Box className="mr-1.5" size={16} />,
      content: <PartnerTab />
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