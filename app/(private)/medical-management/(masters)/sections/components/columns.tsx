"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { SectionList } from "../../schemas/templates"
import { format, parseISO } from "date-fns"
import { sectionTypes } from "../utils"

export const columns: ColumnDef<SectionList>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => <div>{sectionTypes?.find((t) => t.value === row.original.type)?.label}</div>
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => <div>{row.original.description}</div>
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: ({ row }) => <div>{format(parseISO(row.original.created_at), "PP")}</div>
  }
]