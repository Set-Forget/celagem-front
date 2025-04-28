"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  ColumnDef
} from "@tanstack/react-table"
import { SupplierList } from "../schema/suppliers"
import { Badge } from "@/components/ui/badge"
import { supplierStatus } from "../utils"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<SupplierList>[] = [
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
    accessorKey: "name",
    header: "Proveedor",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = supplierStatus[row.getValue("status") as keyof typeof supplierStatus];
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
    accessorKey: "email",
    header: "Correo electrónico",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "tax_id",
    header: "Identificación fiscal",
    cell: ({ row }) => <div>{row.getValue("tax_id")}</div>,
  },
  {
    accessorKey: "contact_address_inline",
    header: "Dirección",
    cell: ({ row }) => <div>{row.getValue("contact_address_inline")}</div>,
  }
]