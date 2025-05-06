"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { AccountsPayableList } from "../schemas/accounts-payable"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<AccountsPayableList>[] = [
  {
    accessorKey: "date",
    header: "Fecha de emisión",
    cell: ({ row }) => {
      if (!row.original.date) return <div>&nbsp;</div>
      return <div className="truncate">
        {format(new Date(row.getValue("date")), "dd MMM yyyy", { locale: es })}
      </div>
    },
  },
  {
    accessorKey: "supplier",
    header: "Proveedor",
    cell: ({ row }) =>
      <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
        {row.original.customer}
      </div>,
  },
  {
    accessorKey: "accounting_account",
    header: "Cuenta contable",
    cell: ({ row }) => <div className="truncate">{row.original.accounting_account}</div>,
  },
  {
    accessorKey: "costs_center",
    header: "Centro de costos",
    cell: ({ row }) => <div className="truncate">{row.original.costs_center}</div>,
  },
  {
    accessorKey: "voucher_type",
    header: "Tipo de comprobante",
    cell: ({ row }) => <div className="truncate">{row.original.voucher_type}</div>,
  },
  {
    accessorKey: "voucher_number",
    header: "Número de comprobante",
    cell: ({ row }) =>
      <div className="truncate">{row.original.voucher_number}</div>,
  },
  {
    accessorKey: "due_date",
    header: "Fecha de vencimiento",
    cell: ({ row }) => {
      if (!row.original.due_date) return <div>&nbsp;</div>
      return <div className="truncate">
        {format(new Date(row.getValue("date")), "dd MMM yyyy", { locale: es })}
      </div>
    },
  },
  {
    accessorKey: "invoiced_amount",
    header: "Monto facturado",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original.invoiced_amount}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original.invoiced_amount),
        0
      );
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "paid_amount",
    header: "Monto pagado",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original.paid_amount}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original.paid_amount),
        0
      );
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "outstanding_amount",
    header: "Monto pendiente",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original.outstanding_amount}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original.outstanding_amount),
        0
      );
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "30_days",
    header: "30 días",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original["30_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original["30_days"]),
        0
      );
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "60_days",
    header: "60 días",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original["60_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original["60_days"]),
        0
      );
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "90_days",
    header: "90 días",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original["90_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original["90_days"]),
        0
      );
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "120_days",
    header: "120 días",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original["120_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original["120_days"]),
        0
      );
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "120+_days",
    header: "120+ días",
    cell: ({ row }) => <div className={cn("truncate", row.original.id === -1 ? "font-semibold" : "")}>
      {row.original.currency}{" "}
      {row.original["120+_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row.original["120+_days"]),
        0
      );
      const currency = table.getRowModel().rows[0]?.original.currency || "";
      return <span className="font-semibold">
        {currency + " " + total.toFixed(2)}
      </span>
    }
  },
]