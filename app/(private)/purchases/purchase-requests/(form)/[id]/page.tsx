'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Paperclip, Sticker } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { PurchaseRequestDetail } from "../../schemas/purchase-requests"
import { purchaseRequestStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import DocumentsTab from "./components/documents-tab"
import NotesTab from "./components/notes-tab"

const fields: FieldDefinition<PurchaseRequestDetail>[] = [
  {
    label: "Solicitado por",
    placeholderLength: 14,
    getValue: (p) => p?.created_by?.name || "No especificado",
  },
  {
    label: "Fecha de solicitud",
    placeholderLength: 10,
    getValue: (p) => p?.created_at ? format(parseISO(p.created_at), "PP", { locale: es }) : "No especificado"
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 10,
    getValue: (p) => p?.request_date ? format(parseISO(p.request_date), "PP", { locale: es }) : "No especificado"
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesTab />
  },
  {
    value: "tab-2",
    label: "Documentos",
    icon: <Paperclip className="mr-1.5" size={16} />,
    content: <DocumentsTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } = useGetPurchaseRequestQuery(id)

  const [tab, setTab] = useState('tab-1')

  const status = purchaseRequestStatus[purchaseRequest?.state as keyof typeof purchaseRequestStatus];

  return (
    <div className="flex flex-col h-full">
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isPurchaseRequestLoading ? "blur-[4px]" : "blur-none")}>
          {isPurchaseRequestLoading ? placeholder(20, true) : purchaseRequest?.name}
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
        <Actions state={purchaseRequest?.state} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isPurchaseRequestLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(purchaseRequest!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <label className="text-muted-foreground text-sm">
                  {field.label}
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isPurchaseRequestLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
        <DataTable
          data={purchaseRequest?.items || []}
          loading={isPurchaseRequestLoading}
          columns={columns}
          pagination={false}
        />
      </div>
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4 h-full"
        contentClassName="h-full"
      />
    </div>
  )
}
