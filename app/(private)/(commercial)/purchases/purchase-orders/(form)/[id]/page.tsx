'use client'

import { TableFooter } from "@/app/(private)/(commercial)/components/table-footer"
import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import RenderFields from "@/components/render-fields"
import { Badge } from "@/components/ui/badge"
import { AdaptedPurchaseOrderDetail } from "@/lib/adapters/purchase-order"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { Box, Paperclip, Sticker, Wallet } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { PurchaseOrderLine } from "../../schemas/purchase-orders"
import { purchaseOrderStatus } from "../../utils"
import Actions from "./actions"
import { columns } from "./components/columns"
import DocumentsTab from "./components/documents-tab"
import FiscalTab from "./components/fiscal"
import NotesTab from "./components/notes-tab"
import SupplierTab from "./components/supplier-tab"
import StatusBadge from "@/components/status-badge"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

const fields: FieldDefinition<AdaptedPurchaseOrderDetail>[] = [
  {
    label: "Solicitado por",
    placeholderLength: 14,
    render: (p) => p?.required_by || "No especificado",
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 10,
    render: (p) => p?.required_date ? format(parseISO(p?.required_date), "PP", { locale: es }) : "No especificada",
  },
  {
    label: "Fecha de creación",
    placeholderLength: 10,
    render: (p) => p?.created_at ? format(parseISO(p.created_at), "PP HH:mm a", { locale: es }) : "No especificada",
  },
  {
    label: "Compañía",
    placeholderLength: 10,
    render: (p) => p?.company?.name || "No especificada",
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
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalTab />
  },
  {
    value: "tab-3",
    label: "Documentos",
    icon: <Paperclip size={16} />,
    content: <DocumentsTab />
  },
  {
    value: "tab-4",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(id);

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isPurchaseOrderLoading ? "blur-[4px]" : "blur-none")}>
          {isPurchaseOrderLoading ? placeholder(7, true) : purchaseOrder?.sequence_id}
        </h1>
      }>
        <div className="mr-auto">
          <StatusBadge status={purchaseOrder?.status} />
        </div>
        <Actions state={purchaseOrder?.status} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <RenderFields
          fields={fields}
          loading={isPurchaseOrderLoading}
          data={purchaseOrder}
        />
        <DataTable
          data={purchaseOrder?.items.map((item) => ({ ...item, currency: purchaseOrder?.currency.name })) ?? []}
          loading={isPurchaseOrderLoading}
          columns={columns}
          pagination={false}
          footer={() =>
            <TableFooter<PurchaseOrderLine>
              items={purchaseOrder?.items ?? []}
              colSpan={columns.length}
              selectors={{
                unitPrice: (item) => item.price_unit,
                quantity: (item) => item.product_qty,
                taxes: (item) => item.taxes,
                currency: () => purchaseOrder?.currency,
              }}
            />}
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
