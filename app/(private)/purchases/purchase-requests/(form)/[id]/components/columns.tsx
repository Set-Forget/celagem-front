"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseRequestItem } from "../../../schemas/purchase-requests"

export const columns: ColumnDef<PurchaseRequestItem>[] = [
  {
    accessorKey: "product_name",
    header: "Material",
    cell: ({ row }) => row.getValue("product_name")
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      return <div>{row.getValue("quantity")}</div>
    },
  }
]