'use client'

import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetCustomerQuery } from "@/lib/services/customers"
import { cn, placeholder } from "@/lib/utils"
import { Calculator, Edit, FileSearch, Mail, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { customerStatus } from "../../utils"
import AccountingTab from "./components/accounting-tab"
import ContactTab from "./components/contact-tab"
import FiscalTab from "./components/fiscal-tab"
import TraceabilityTab from "./components/traceability-tab"

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
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: customer, isLoading: isCustomerLoading } = useGetCustomerQuery(id)

  const status = customerStatus[String(customer?.status) as keyof typeof customerStatus];

  return (
    <div className="flex flex-col h-full">
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isCustomerLoading ? "blur-[4px]" : "blur-none")}>
          {isCustomerLoading ? placeholder(13, true) : customer?.name}
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
          onClick={() => router.push(`/sales/customers/${id}/edit`)}
        >
          <Edit />
          Editar
        </Button>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Saldo pendiente</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="away" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isCustomerLoading ? "blur-[4px]" : "blur-none")}>
              {isCustomerLoading ? placeholder(4) : customer?.payment_amount_due.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Saldo vencido</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="busy" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isCustomerLoading ? "blur-[4px]" : "blur-none")}>
              {isCustomerLoading ? placeholder(4) : customer?.payment_amount_overdue.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Total facturado</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="online" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isCustomerLoading ? "blur-[4px]" : "blur-none")}>
              {isCustomerLoading ? placeholder(4) : customer?.total_invoiced.toFixed(2)}
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
