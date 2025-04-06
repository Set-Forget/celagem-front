'use client'

import { DataTable } from "@/components/data-table"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { useGetBillQuery } from "@/lib/services/bills"
import { cn, placeholder } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Box, FileText, Paperclip } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { BillDetail } from "../../schemas/bills"
import { billStatus } from "../../utils"
import Actions from "./actions"
import AccountingTab from "./components/accounting-tab"
import { columns } from "./components/columns"
import DocumentsTab from "./components/documents-tab"
import SupplierTab from "./components/supplier-tab"
import TableFooter from "./components/table-footer"

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<BillDetail>[] = [
  {
    label: "Fecha de emisión",
    placeholderLength: 14,
    getValue: (p) => format(p.date, "PPP", { locale: es }),
  },
  {
    label: "Fecha de vencimiento",
    placeholderLength: 10,
    getValue: (p) => format(p.due_date, "PPP", { locale: es }),
  },
  {
    label: "Condición de pago",
    placeholderLength: 10,
    getValue: (p) => p.payment_term || "No especificado",
  },
  {
    label: "Método de pago",
    placeholderLength: 10,
    getValue: (p) => p.payment_method || "No especificado",
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
    label: "Proveedor",
    icon: <Box className="mr-1.5" size={16} />,
    content: <SupplierTab />
  },
  {
    value: "tab-2",
    label: "Contabilidad",
    icon: <FileText className="mr-1.5" size={16} />,
    content: <AccountingTab />
  },
  {
    value: "tab-3",
    label: "Documentos",
    icon: <Paperclip className="mr-1.5" size={16} />,
    content: <DocumentsTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(id);

  const status = billStatus[
    bill?.status === "posted" && new Date(bill?.due_date) < new Date()
      ? "overdue"
      : bill?.status as keyof typeof billStatus
  ];

  return (
    <>
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
        <Actions state={bill?.status} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-base font-medium">General</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isBillLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(bill!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <label className="text-muted-foreground text-sm">
                  {field.label}
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isBillLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
        <DataTable
          data={bill?.items.map((item) => ({ ...item, currency: bill?.currency })) ?? []}
          loading={isBillLoading}
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