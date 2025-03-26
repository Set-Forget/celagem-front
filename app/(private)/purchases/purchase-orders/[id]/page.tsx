'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { cn, placeholder } from "@/lib/utils"

import DataTabs from "@/components/data-tabs"
import { Box, ChevronDown, Paperclip } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { PurchaseOrderDetail } from "../schemas/purchase-orders"
import { purchaseOrderStatus } from "../utils"
import { columns } from "./components/columns"
import DocumentsTab from "./components/documents-tab"
import SupplierTab from "./components/supplier-tab"
import TableFooter from "./components/table-footer"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Actions from "./actions"

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<PurchaseOrderDetail>[] = [
  {
    label: "Solicitado por",
    placeholderLength: 14,
    getValue: (p) => p.required_by,
  },
  {
    label: "Fecha de solicitud",
    placeholderLength: 10,
    getValue: (p) => 'xxxx' // ! No existe en el backend, pero debería ser p.request_date
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 10,
    getValue: (p) => format(p.required_date, "PPP", { locale: es })
  },
  {
    label: "Fecha de creación",
    placeholderLength: 10,
    getValue: (p) => format(p.purchase_order_date, "PPP", { locale: es })
  },
  {
    label: "Sede",
    placeholderLength: 10,
    getValue: (p) => 'xxxx' // ! No existe en el backend, pero debería ser p.headquarter_id
  },
  {
    label: "Notas",
    placeholderLength: 30,
    getValue: (p) => p.notes || "No hay notas.", // ! Debería ser internal_notes.
    className: "col-span-2"
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
    label: "Documentos",
    icon: <Paperclip className="mr-1.5" size={16} />,
    content: <DocumentsTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState('tab-1')

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(id);

  const status = purchaseOrderStatus[purchaseOrder?.status as keyof typeof purchaseOrderStatus]

  return (
    <>
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
          data={purchaseOrder?.items.map((item) => ({ ...item, currency: purchaseOrder?.currency })) ?? []}
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
    </>
  )
}
