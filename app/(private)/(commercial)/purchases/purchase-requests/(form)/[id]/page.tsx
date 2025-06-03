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
import RenderFields from "@/components/render-fields"
import { AdaptedPurchaseRequestDetail } from "@/lib/adapters/purchase-requests"

const fields: FieldDefinition<AdaptedPurchaseRequestDetail>[] = [
  {
    label: "Solicitado por",
    placeholderLength: 14,
    render: (p) => p?.created_by?.name || "No especificado",
  },
  {
    label: "Fecha de solicitud",
    placeholderLength: 10,
    render: (p) => p?.created_at ? format(parseISO(p.created_at), "PP", { locale: es }) : "No especificado"
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 10,
    render: (p) => p?.request_date ? format(parseISO(p.request_date), "PP", { locale: es }) : "No especificado"
  },
  {
    label: "Compañía",
    placeholderLength: 10,
    render: (p) => p?.company?.name || "No especificado",
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

  const [tab, setTab] = useState(tabs[0].value)

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
        <RenderFields
          fields={fields}
          loading={isPurchaseRequestLoading}
          data={purchaseRequest}
        />
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
