"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CostCenterList } from "../schemas/cost-centers"
import { costCenters } from "../utils"

export const columns: ColumnDef<CostCenterList>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div className="font-medium">{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "active",
    header: "Estado",
    cell: ({ row }) => {
      const status = costCenters[row.getValue("active") as keyof typeof costCenters]
      return <Badge
        variant="custom"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
      >
        {status.label}
      </Badge>
    },
  },
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <div className="flex gap-1">
        <div className="font-medium">{row.getValue("code")}</div>
      </div>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div className="font-medium">{row.getValue("plan")}</div>
      </div>
    ),
  }
]