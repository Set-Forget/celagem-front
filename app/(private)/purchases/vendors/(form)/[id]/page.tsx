'use client'

import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetSupplierQuery } from "@/lib/services/suppliers"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { Calculator, Edit, FileSearch, Mail, Wallet } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { SupplierDetail } from "../../schema/suppliers"
import { supplierStatus } from "../../utils"
import AccountingTab from "./components/accounting-tab"
import ContactTab from "./components/contact-tab"
import FiscalTab from "./components/fiscal-tab"
import TraceabilityTab from "./components/traceability-tab"

const fields: FieldDefinition<SupplierDetail>[] = [
  {
    label: "Razón social",
    placeholderLength: 16,
    getValue: (p) => p.commercial_company_name || "No especificado",
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Contacto",
    icon: <Mail className="mr-1.5" size={16} />,
    content: <ContactTab />
  },
  {
    value: "tab-2",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalTab />
  },
  {
    value: "tab-3",
    label: "Contabilidad",
    icon: <Calculator className="mr-1.5" size={16} />,
    content: <AccountingTab />
  },
  {
    value: "tab-4",
    label: "Auditoría",
    icon: <FileSearch className="mr-1.5" size={16} />,
    content: <TraceabilityTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: supplier, isLoading: isSupplierLoading } = useGetSupplierQuery(id)

  const status = supplierStatus[String(supplier?.status) as keyof typeof supplierStatus];

  return (
    <div className="flex flex-col h-full">
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
          {isSupplierLoading ? placeholder(13, true) : supplier?.name}
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
        <Button className="ml-auto" size="sm">
          <Edit />
          Editar proveedor
        </Button>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        {fields.map((field) => {
          const displayValue = isSupplierLoading
            ? placeholder(field.placeholderLength)
            : field.getValue(supplier!) ?? "";
          return (
            <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
              <label className="text-muted-foreground text-sm">
                {field.label}
              </label>
              <span
                className={cn(
                  "text-sm transition-all duration-300",
                  isSupplierLoading ? "blur-[4px]" : "blur-none"
                )}
              >
                {displayValue}
              </span>
            </div>
          );
        })}
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Saldo pendiente</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="away" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
              {isSupplierLoading ? placeholder(4) : supplier?.payment_amount_due.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Saldo vencido</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="busy" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
              {isSupplierLoading ? placeholder(4) : supplier?.payment_amount_overdue.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Total facturado</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="online" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
              {isSupplierLoading ? placeholder(4) : supplier?.total_invoiced.toFixed(2)}
            </span>
          </div>
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
