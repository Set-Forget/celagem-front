"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { JournalList } from "../schema/journals"
import { journalStatus, journalTypes } from "../utils"

export const columns: ColumnDef<JournalList>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="capitalize flex gap-1 font-medium">
        {`(${row.original.code.toUpperCase()}) `}
        <div className="font-normal">
          {row.getValue("name")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "active",
    header: "Estado",
    cell: ({ row }) => {
      const status = journalStatus[row.getValue("active") as keyof typeof journalStatus];
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
    accessorKey: "type",
    header: "Tipo de diario",
    cell: ({ row }) => journalTypes.find((type) => type.value === row.getValue("type"))?.label,
  },
]