'use client'

import CustomSonner from "@/components/custom-sonner"
import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDeleteInvoiceMutation, useGetInvoiceQuery, useListInvoicesQuery, useUpdateInvoiceMutation } from "@/lib/services/invoices"
import { cn, placeholder } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Check, ChevronDown, Edit, Ellipsis, Eye, FileText, Paperclip, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { invoiceStatus, invoiceTypes } from "../../utils"
import { columns } from "./components/columns"
import TableFooter from "./components/table-footer"
import { InvoiceDetail } from "../../schemas/invoices"
import CustomerTab from "./components/customer-tab"
import AccountingTab from "./components/accounting-tab"
import DocumentsTab from "./components/documents-tab"
import DataTabs from "@/components/data-tabs"
import { useState } from "react"
import Actions from "./actions"

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<InvoiceDetail>[] = [
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
  },
  {
    label: "Términos y condiciones",
    placeholderLength: 20,
    getValue: (p) => p.tyc_notes || "No hay términos y condiciones",
    className: "col-span-2"
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Cliente",
    icon: <Box className="mr-1.5" size={16} />,
    content: <CustomerTab />
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

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id);
  const { data: invoices } = useListInvoicesQuery()

  const status = invoiceStatus[
    invoice?.status === "posted" && new Date(invoice?.due_date) < new Date()
      ? "overdue"
      : invoice?.status as keyof typeof invoiceStatus
  ];

  return (
    <>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300 flex items-center gap-1", isInvoiceLoading ? "blur-[4px]" : "blur-none")}>
          {isInvoiceLoading ? placeholder(13, true) : invoice?.number}
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
        <Actions state={invoice?.status} type={invoices?.data?.find((i) => i.id === invoice?.id)?.type} />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isInvoiceLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(invoice!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <label className="text-muted-foreground text-sm">
                  {field.label}
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isInvoiceLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
        <DataTable
          data={invoice?.items.map((item) => ({ ...item, currency: invoice?.currency.name })) ?? []}
          loading={isInvoiceLoading}
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
