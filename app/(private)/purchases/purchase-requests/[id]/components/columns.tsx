"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseRequestItem } from "../../schemas/purchase-requests"

export const columns: ColumnDef<PurchaseRequestItem>[] = [
  {
    accessorKey: "product_name",
    header: "Material",
    cell: ({ row }) => (
      <div>
        {row.getValue("product_name")}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      return <div>{row.getValue("quantity")}</div>
    },
  }
]