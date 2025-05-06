"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { VisitList } from "../schemas/visits"
import { visitStatus } from "../utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<VisitList>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "vist_number",
    header: "Número",
    cell: ({ row }) => <div className="font-medium">{row.original.visit_number}</div>
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = visitStatus[row.getValue("status") as keyof typeof visitStatus];
      return (
        <Badge
          variant="custom"
          className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
        >
          {status?.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "doctor",
    header: "Profesional",
    cell: ({ row }) => <div>xxxx</div>
  },
  {
    accessorKey: "patient",
    header: "Paciente",
    cell: ({ row }) => <div>xxxx</div>
  },
  {
    accessorKey: "template",
    header: "Tipo de atención",
    cell: ({ row }) => <div>xxxx</div>
  },
  {
    accessorKey: "clinic",
    header: "Sede",
    cell: ({ row }) => <div>xxxx</div>
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
    cell: ({ row }) => <div>{format(row.original.createdAt, "PPP", { locale: es })}</div>
  },
]