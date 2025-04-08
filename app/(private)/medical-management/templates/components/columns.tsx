"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { TemplateList } from "../../calendar/schemas/templates"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { templateStatus } from "../utils"

export const columns: ColumnDef<TemplateList>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "sections",
    header: "Secciones",
    cell: ({ row }) => <div>{row.original.sections.length}</div>
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const status = templateStatus[String(row.getValue("isActive")) as keyof typeof templateStatus]
      return <Badge
        variant="custom"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
      >
        {status.label}
      </Badge>
    },
  }
]