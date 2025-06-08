'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import RenderFields from "@/components/render-fields"
import { Badge } from "@/components/ui/badge"
import { AdaptedBillDetail } from "@/lib/adapters/bills"
import { useGetBillQuery } from "@/lib/services/bills"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Paperclip, Sticker } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { billStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import DocumentsTab from "./components/documents-tab"
import NotesTab from "./components/notes-tab"
import SupplierTab from "./components/supplier-tab"
import { TableFooter } from "@/app/(private)/(commercial)/components/table-footer"
import { BillLine } from "../../schemas/bills"

const fields: FieldDefinition<AdaptedBillDetail>[] = [
  {
    label: "Número de factura",
    placeholderLength: 14,
    render: (p) => p?.custom_sequence_number || p?.sequence_id || "No especificado",
  },
  {
    label: "Fecha de emisión",
    placeholderLength: 14,
    render: (p) => format(parseISO(p.date), "PP", { locale: es }),
  },
  {
    label: "Fecha de vencimiento",
    placeholderLength: 10,
    render: (p) => format(parseISO(p.due_date), "PP", { locale: es }),
  },
  {
    label: "Fecha de contabilización",
    placeholderLength: 14,
    render: (p) => format(parseISO(p.accounting_date), "PP", { locale: es }),
  },
  {
    label: "Condición de pago",
    placeholderLength: 10,
    render: (p) => p?.payment_term?.name || "No especificado",
  },
  {
    label: "Método de pago",
    placeholderLength: 10,
    render: (p) => p?.payment_method?.name || "No especificado",
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Proveedor",
    icon: <Box size={16} />,
    content: <SupplierTab />
  },
  {
    value: "tab-2",
    label: "Documentos",
    icon: <Paperclip size={16} />,
    content: <DocumentsTab />
  },
  {
    value: "tab-3",
    label: "Notes",
    icon: <Sticker size={16} />,
    content: <NotesTab />
  },
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(id);

  const status = billStatus[bill?.status as keyof typeof billStatus];

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isBillLoading ? "blur-[4px]" : "blur-none")}>
          {isBillLoading ? placeholder(13, true) : bill?.number}
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
        <Actions />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <RenderFields
          fields={fields}
          loading={isBillLoading}
          data={bill}
        />
        <div className="[&_*[data-table='true']]:w-[calc(100svw-306px)]">
          <DataTable
            data={bill?.items.map((item) => ({ ...item, currency: bill?.currency.name })) ?? []}
            loading={isBillLoading}
            columns={columns}
            pagination={false}
            footer={() =>
              <TableFooter<BillLine>
                items={bill?.items ?? []}
                colSpan={columns.length}
                selectors={{
                  unitPrice: (item) => item.price_unit,
                  quantity: (item) => item.quantity,
                  taxes: (item) => item.taxes,
                  currency: () => bill?.currency,
                  pendingAmount: () => bill?.amount_residual ?? 0
                }}
              />
            }
          />
        </div>
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