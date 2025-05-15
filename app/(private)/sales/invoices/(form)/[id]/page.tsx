'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { useGetInvoiceQuery, useListInvoicesQuery } from "@/lib/services/invoices"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Paperclip, Sticker } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { InvoiceDetail } from "../../schemas/invoices"
import { invoiceStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import CustomerTab from "./components/customer-tab"
import DocumentsTab from "./components/documents-tab"
import NotesTab from "./components/notes-tab"
import TableFooter from "./components/table-footer"

const fields: FieldDefinition<InvoiceDetail>[] = [
  {
    label: "Fecha de emisión",
    placeholderLength: 14,
    getValue: (p) => p.date ? format(parseISO(p.date), "PP", { locale: es }) : "No especificado",
  },
  {
    label: "Fecha de vencimiento",
    placeholderLength: 10,
    getValue: (p) => p.due_date ? format(parseISO(p.due_date), "PP", { locale: es }) : "No especificado",
  },
  {
    label: "Fecha de contabilización",
    placeholderLength: 14,
    getValue: (p) => p.accounting_date ? format(parseISO(p.accounting_date), "PP", { locale: es }) : "No especificado",
  },
  {
    label: "Condición de pago",
    placeholderLength: 10,
    getValue: (p) => p.payment_term?.name || "No especificado",
  },
  {
    label: "Método de pago",
    placeholderLength: 10,
    getValue: (p) => p.payment_method?.name || "No especificado",
  },
];

const tabs = [
  {
    value: "tab-1",
    label: "Cliente",
    icon: <Box className="mr-1.5" size={16} />,
    content: <CustomerTab />
  },
  {
    value: "tab-2",
    label: "Documentos",
    icon: <Paperclip className="mr-1.5" size={16} />,
    content: <DocumentsTab />
  },
  {
    value: "tab-3",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesTab />
  },
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id);
  const { data: invoices } = useListInvoicesQuery()

  const status = invoiceStatus[
    invoice?.status === "posted" && new Date(invoice?.due_date) < new Date()
      ? "overdue"
      : invoice?.status as keyof typeof invoiceStatus
  ];

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
        <Actions state={invoice?.status} type={invoices?.data?.find((i) => i.id === invoice?.id)?.type} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isInvoiceLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(invoice!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <label className="text-muted-foreground text-sm">
                  {field.label}
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isInvoiceLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
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
