'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import DataTabs from "@/components/data-tabs"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Paperclip, Sticker, Wallet } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { PurchaseOrderDetail } from "../../schemas/purchase-orders"
import { purchaseOrderStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import DocumentsTab from "./components/documents-tab"
import FiscalTab from "./components/fiscal"
import NotesTab from "./components/notes-tab"
import SupplierTab from "./components/supplier-tab"
import TableFooter from "./components/table-footer"

const fields: FieldDefinition<PurchaseOrderDetail>[] = [
  {
    label: "Solicitado por",
    placeholderLength: 14,
    getValue: (p) => p?.required_by || "No especificado",
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 10,
    getValue: (p) => p?.required_date ? format(parseISO(p?.required_date), "PP", { locale: es }) : "No especificada",
  },
  {
    label: "Fecha de creación",
    placeholderLength: 10,
    getValue: (p) => p?.created_at ? format(parseISO(p.created_at), "PP", { locale: es }) : "No especificada",
  },
  {
    label: "Compañía",
    placeholderLength: 10,
    getValue: (p) => p?.company?.name || "No especificada",
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Proveedor",
    icon: <Box className="mr-1.5" size={16} />,
    content: <SupplierTab />
  },
  {
    value: "tab-2",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalTab />
  },
  {
    value: "tab-3",
    label: "Documentos",
    icon: <Paperclip className="mr-1.5" size={16} />,
    content: <DocumentsTab />
  },
  {
    value: "tab-4",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(id);

  const status = purchaseOrderStatus[purchaseOrder?.status as keyof typeof purchaseOrderStatus]

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isPurchaseOrderLoading ? "blur-[4px]" : "blur-none")}>
          {isPurchaseOrderLoading ? placeholder(7, true) : purchaseOrder?.number}
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
        <Actions state={purchaseOrder?.status} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isPurchaseOrderLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(purchaseOrder!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <label className="text-muted-foreground text-sm">
                  {field.label}
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isPurchaseOrderLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
        <DataTable
          data={purchaseOrder?.items.map((item) => ({ ...item, currency: purchaseOrder?.currency.name })) ?? []}
          loading={isPurchaseOrderLoading}
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
