'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests"
import { cn, placeholder } from "@/lib/utils"
import { useParams } from "next/navigation"
import { PurchaseRequestDetail } from "../schemas/purchase-requests"
import { purchaseRequestStatus } from "../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import DataTabs from "@/components/data-tabs"
import { useState } from "react"
import { FileText, Paperclip } from "lucide-react"
import DocumentsTab from "./components/documents-tab"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<PurchaseRequestDetail>[] = [
  {
    label: "Solicitado por",
    placeholderLength: 14,
    getValue: (p) => "xxxxx",
  },
  {
    label: "Fecha de solicitud",
    placeholderLength: 10,
    getValue: (p) => "xxxxx"
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 10,
    getValue: (p) => format(p.request_date, "PPP", { locale: es })
  },
  {
    label: "Notas",
    placeholderLength: 30,
    getValue: (p) => "xxxxx",
    className: "col-span-2"
  }
];

const tabs = [
  {
    value: "tab-1",
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
    <>
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
        <h2 className="text-base font-medium">General</h2>
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
        triggerClassName="mt-4"
      />
    </>
  )
}
