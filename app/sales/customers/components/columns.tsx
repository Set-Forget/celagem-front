"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Customer } from "../schema/customers"
import { CUSTOMER_TYPE, SALES_CONDITION } from "../adapters/customers"

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "customer_name",
    header: "Proveedor",
    cell: ({ row }) => <div className="font-medium">{row.getValue("customer_name")}</div>,
  },
  {
    accessorKey: "customer_type",
    header: "Tipo",
    cell: ({ row }) => {
      const customerType = CUSTOMER_TYPE[row.getValue("customer_type") as keyof typeof CUSTOMER_TYPE]
      return <div>{customerType}</div>
    }
  },
  {
    accessorKey: "fiscal_category",
    header: "Condición frente al IVA",
    cell: ({ row }) => {
      const salesCondition = SALES_CONDITION[row.getValue("fiscal_category") as keyof typeof SALES_CONDITION]
      return <div>{salesCondition}</div>
    }
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <></>
      )
    },
  },
]