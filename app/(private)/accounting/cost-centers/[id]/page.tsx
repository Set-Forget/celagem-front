'use client'

import Dropdown from "@/components/dropdown"
import Header from "@/components/header"
import RenderFields from "@/components/render-fields"
import StatusDot from "@/components/status-dot"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGetCostCenterQuery, useUpdateCostCenterMutation } from "@/lib/services/cost-centers"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { ChevronDown, EditIcon, Ellipsis } from "lucide-react"
import { useParams } from "next/navigation"
import { CostCenterDetail } from "../schemas/cost-centers"
import { costCenters } from "../utils"

const fields: FieldDefinition<CostCenterDetail>[] = [
  {
    label: "Código",
    placeholderLength: 14,
    render: (p) => p.code || 'No especificado',
  },
  {
    label: "Plan",
    placeholderLength: 14,
    render: (p) => p.plan.name || 'No especificado',
  },
  {
    label: "Moneda",
    placeholderLength: 14,
    render: (p) => p.currency || 'No especificado',
  }
];

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [sendMessage] = useSendMessageMutation();
  const [updateCostCenter] = useUpdateCostCenterMutation()

  const { data: costCenter, isLoading: isCostCenterLoading } = useGetCostCenterQuery(id);

  const status = costCenters[String(costCenter?.active) as keyof typeof costCenters];

  const handleUpdateAppointment = async ({ status }: { status: "active" | "inactive" }) => {
    try {
      await updateCostCenter({
        id: id,
        body: { active: status === "active" ? true : false }
      }).unwrap()
    } catch (error) {
      sendMessage({
        location: "app/(private)/accounting/cost-centers/[id]/page.tsx",
        rawError: error,
        fnLocation: "handleUpdateAppointment"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isCostCenterLoading ? "blur-[4px]" : "blur-none")}>
          {isCostCenterLoading ? placeholder(13, true) : costCenter?.name}
        </h1>
      }>
        <div className="mr-auto">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Badge
                variant="custom"
                className={cn(status?.bg_color, status?.text_color)}
              >
                {status?.label}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-32">
              <DropdownMenuItem
                onSelect={() => handleUpdateAppointment({ status: "active" })}
              >
                <StatusDot className="text-blue-500 !h-2 !w-2 shadow-md rounded-full shadow-blue-500/50" />
                <span>Activo</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleUpdateAppointment({ status: "inactive" })}
              >
                <StatusDot className="text-gray-500 !h-2 !w-2 shadow-md rounded-full shadow-gray-500/50" />
                <span>Inactivo</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => console.log("Editar")}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
        </Dropdown>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <RenderFields
          fields={fields}
          loading={isCostCenterLoading}
          data={costCenter}
        />
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Balance</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="online" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isCostCenterLoading ? "blur-[4px]" : "blur-none")}>
              {isCostCenterLoading ? placeholder(4) : costCenter?.balance.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Debe</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="away" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isCostCenterLoading ? "blur-[4px]" : "blur-none")}>
              {isCostCenterLoading ? placeholder(4) : costCenter?.debit.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Haber</label>
          <div className="flex gap-1.5 items-center">
            <StatusIndicator status="busy" size="sm" />
            <span className={cn("text-sm font-medium transition-all duration-300", isCostCenterLoading ? "blur-[4px]" : "blur-none")}>
              {isCostCenterLoading ? placeholder(4) : costCenter?.credit.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}