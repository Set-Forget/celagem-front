'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { useGetDebitNoteQuery } from "@/lib/services/debit-notes"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Receipt } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { DebitNoteDetail } from "../../schemas/debit-notes"
import { debitNoteStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import CustomerTab from "./components/customer-tab"
import InvoiceTab from "./components/invoice-tab"
import TableFooter from "./components/table-footer"

const fields: FieldDefinition<DebitNoteDetail>[] = [
  {
    label: "Fecha de emisión",
    placeholderLength: 14,
    getValue: (p) => p.date ? format(p.date, "PPP", { locale: es }) : "No especificado",
  },
  {
    label: "Fecha de vencimiento",
    placeholderLength: 10,
    getValue: (p) => p.due_date ? format(p.due_date, "PPP", { locale: es }) : "No especificado",
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
  {
    label: "Notas",
    placeholderLength: 20,
    getValue: (p) => p.internal_notes || "No hay notas",
    className: "col-span-2"
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Factura",
    icon: <Receipt className="mr-1.5" size={16} />,
    content: <InvoiceTab />
  },
  {
    value: "tab-2",
    label: "Cliente",
    icon: <Box className="mr-1.5" size={16} />,
    content: <CustomerTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: debitNote, isLoading: isDebitNoteLoading } = useGetDebitNoteQuery(id)

  const status = debitNoteStatus[debitNote?.status === "posted" && new Date(debitNote?.due_date) < new Date() ? "overdue" : debitNote?.status as keyof typeof debitNoteStatus];

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isDebitNoteLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(debitNote!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <label className="text-muted-foreground text-sm">
                  {field.label}
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isDebitNoteLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
        <DataTable
          data={debitNote?.items.map((item) => ({ ...item, currency: debitNote?.currency.name })) ?? []}
          loading={isDebitNoteLoading}
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