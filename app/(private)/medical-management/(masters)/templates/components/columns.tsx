"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { templateStatus } from "../utils"
import { TemplateList } from "../../schemas/templates"

export const columns: ColumnDef<TemplateList>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const status = templateStatus[String(row.getValue("is_active")) as keyof typeof templateStatus]
      return <Badge
        variant="custom"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
      >
        {status.label}
      </Badge>
    },
  },
  {
    accessorKey: "sections",
    header: "Secciones",
    cell: ({ row }) => <div>{row.original.sections.length}</div>
  }
]