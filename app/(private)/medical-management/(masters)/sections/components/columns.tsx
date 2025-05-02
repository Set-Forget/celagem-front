"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { SectionList } from "../../schemas/templates"

export const columns: ColumnDef<SectionList>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      return 'xxxx'
      /*       const status = sectionStatus[String(row.getValue("is_active")) as keyof typeof sectionStatus]
            return <Badge
              variant="custom"
              className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
            >
              {status.label}
            </Badge> */
    },
  },
  {
    accessorKey: "type",
    header: "Secciones",
    cell: ({ row }) => <div>xxxx</div>
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => <div>xxxx</div>
  }

]