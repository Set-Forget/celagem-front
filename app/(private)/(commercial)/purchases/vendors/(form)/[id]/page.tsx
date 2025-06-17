'use client'

import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetSupplierQuery } from "@/lib/services/suppliers"
import { cn, FieldDefinition, formatNumber, placeholder } from "@/lib/utils"
import { Calculator, Edit, FileSearch, Mail, Router, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { SupplierDetail } from "../../schema/suppliers"
import { supplierStatus } from "../../utils"
import AccountingTab from "./components/accounting-tab"
import ContactTab from "./components/contact-tab"
import FiscalTab from "./components/fiscal-tab"
import TraceabilityTab from "./components/traceability-tab"
import RenderFields from "@/components/render-fields"

const fields: FieldDefinition<SupplierDetail>[] = [
  {
    label: "Razón social",
    placeholderLength: 16,
    render: (p) => p.legal_name || "No especificado",
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Contacto",
    icon: <Mail size={16} />,
    content: <ContactTab />
  },
  {
    value: "tab-2",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalTab />
  },
  {
    value: "tab-3",
    label: "Contabilidad",
    icon: <Calculator size={16} />,
    content: <AccountingTab />
  },
  {
    value: "tab-4",
    label: "Auditoría",
    icon: <FileSearch size={16} />,
    content: <TraceabilityTab />
  }
]

export default function Page() {
  const router = useRouter()

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
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`/purchases/vendors/${id}/edit`)}
        >
          <Edit />
          Editar
        </Button>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <RenderFields
          fields={fields}
          data={supplier}
          loading={isSupplierLoading}
        />
        {/* <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Saldo pendiente</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="away" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
              {isSupplierLoading ? placeholder(4) : formatNumber(supplier?.payment_amount_due)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Saldo vencido</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="busy" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
              {isSupplierLoading ? placeholder(4) : formatNumber(supplier?.payment_amount_overdue)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Total facturado</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="online" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
              {isSupplierLoading ? placeholder(4) : formatNumber(supplier?.total_invoiced)}
            </span>
          </div>
        </div> */}
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
