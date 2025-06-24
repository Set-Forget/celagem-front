'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import RenderFields from "@/components/render-fields"
import { StatusBadge } from "@/components/status-badge"
import { AdaptedPurchaseReceiptDetail } from "@/lib/adapters/purchase-receipts"
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Paperclip, Sticker } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import Actions from "./actions"
import { columns } from "./components/columns"
import DocumentsTab from "./components/documents-tab"
import NotesTab from "./components/notes-tab"
import SupplierTab from "./components/supplier-tab"

const fields: FieldDefinition<AdaptedPurchaseReceiptDetail>[] = [
  {
    label: "Ubicación de recepción",
    placeholderLength: 14,
    render: (p) => p.reception_location.name || "No especificado",
  },
  {
    label: "Fecha de recepción",
    placeholderLength: 12,
    render: (p) => format(parseISO(p.reception_date), "PP", { locale: es }),
  },
  /*   {
      label: "Fecha de requerimiento",
      placeholderLength: 12,
      render: (p) => format(parseISO(p.scheduled_date), "PP", { locale: es }),
    } */
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
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesTab />
  },
  {
    value: "tab-3",
    label: "Documentos",
    icon: <Paperclip size={16} />,
    content: <DocumentsTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: purchaseReceipt, isLoading: isPurchaseReceiptLoading } = useGetPurchaseReceiptQuery(id);

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isPurchaseReceiptLoading ? "blur-[4px]" : "blur-none")}>
          {isPurchaseReceiptLoading ? placeholder(11, true) : purchaseReceipt?.sequence_id}
        </h1>
      }>
        <div className="mr-auto">
          <StatusBadge status={purchaseReceipt?.status} />
        </div>
        <div className="ml-auto">
          <Actions state={purchaseReceipt?.status} />
        </div>
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <RenderFields
          fields={fields}
          data={purchaseReceipt}
          loading={isPurchaseReceiptLoading}
        />
        <DataTable
          data={purchaseReceipt?.items ?? []}
          loading={isPurchaseReceiptLoading}
          columns={columns}
          pagination={false}
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
