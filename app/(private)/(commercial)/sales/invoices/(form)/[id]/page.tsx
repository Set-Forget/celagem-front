'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import RenderFields from "@/components/render-fields"
import { Badge } from "@/components/ui/badge"
import { AdaptedInvoiceDetail } from "@/lib/adapters/invoices"
import { useGetInvoiceQuery, useListInvoicesQuery } from "@/lib/services/invoices"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Paperclip, Sticker } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { invoiceStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import CustomerTab from "./components/customer-tab"
import DocumentsTab from "./components/documents-tab"
import NotesTab from "./components/notes-tab"
import TableFooter from "./components/table-footer"

const fields: FieldDefinition<AdaptedInvoiceDetail>[] = [
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
];

const tabs = [
  {
    value: "tab-1",
    label: "Cliente",
    icon: <Box size={16} />,
    content: <CustomerTab />
  },
  {
    value: "tab-2",
    label: "Documentos",
    icon: <Paperclip size={16} />,
    content: <DocumentsTab />
  },
  {
    value: "tab-3",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesTab />
  },
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id);
  const { data: invoices } = useListInvoicesQuery()

  const status = invoiceStatus[invoice?.status as keyof typeof invoiceStatus];
  console.log(invoice)
  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300 flex items-center gap-1", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
          {isInvoiceLoading ? placeholder(13, true) : invoice?.number}
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
        <Actions state={invoice?.status} type={invoices?.find((i) => i.id === invoice?.id)?.type} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <RenderFields
          fields={fields}
          data={invoice}
          loading={isInvoiceLoading}
        />
        <DataTable
          data={invoice?.items.map((item) => ({ ...item, currency: invoice?.currency.name })) ?? []}
          loading={isInvoiceLoading}
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
