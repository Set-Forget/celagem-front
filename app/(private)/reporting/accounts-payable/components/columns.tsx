"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { AccountsPayableList } from "../schemas/accounts-payable"
import { cn, formatNumber } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { voucherType } from "../utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { routes } from "@/lib/routes"

const typeToRoute: Record<string, (id: number) => string> = {
  out_invoice: routes.invoice.detail,
  out_credit_note: routes.salesCreditNote.detail,
  out_debit_note: routes.salesDebitNote.detail,
  entry: routes.journalEntries.detail,
  payment: routes.journalEntries.detail,
  charge: routes.journalEntries.detail,
}

export const columns: ColumnDef<AccountsPayableList>[] = [
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
    cell: ({ row }) => {
      if (row.original.id < 0) return
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={row.original.id < 0 || (row.original.outstanding_amount ?? 0) === 0 || (row.original.voucher_type !== "in_invoice" && row.original.voucher_type !== "in_debit_note")}
        />
      )
    },
    footer: () => <div><div>Total</div></div>,
    enableSorting: false,
    enableHiding: false,
    size: 50,
    enablePinning: false,
    enableResizing: false,
  },
  {
    accessorKey: "date",
    header: "Fecha de emisión",
    cell: ({ row }) => {
      if (!row.original.date) return <div>&nbsp;</div>
      return <div className="truncate">
        {format(parseISO(row.getValue("date")), "dd MMM yyyy", { locale: es })}
      </div>
    },
  },
  {
    accessorKey: "partner",
    header: "Proveedor",
    cell: ({ row }) => {
      if (row.original.id < 0) return <div>&nbsp;</div>
      return <Button
        variant="link"
        className="p-0 h-auto text-foreground"
        asChild
      >
        <Link
          href={routes.suppliers.detail(row.original.partner.id)}
          target="_blank"
        >
          {row.original.partner.name}
        </Link>
      </Button>
    }
  },
  {
    accessorKey: "voucher_type",
    header: "Tipo de comprobante",
    cell: ({ row }) => <div className="truncate">{row?.original?.voucher_type ? voucherType[row?.original?.voucher_type as keyof typeof voucherType] : ""}</div>,
  },
  {
    accessorKey: "voucher_number",
    header: "Número de comprobante",
    cell: ({ row }) => {
      if (row.original.id < 0) return <div>&nbsp;</div>
      return <Button
        variant="link"
        className="p-0 h-auto text-foreground"
        asChild
      >
        <Link
          href={row.original.voucher_type ? typeToRoute[row.original.voucher_type]?.(row.original.id) || "#" : "#"}
          target="_blank"
        >
          {row.original.voucher_number}
        </Link>
      </Button>
    }
  },
  {
    accessorKey: "due_date",
    header: "Fecha de vencimiento",
    cell: ({ row }) => {
      if (!row?.original?.due_date) return <div>&nbsp;</div>
      return <div className="truncate">
        {format(parseISO(row.getValue("due_date")), "dd MMM yyyy", { locale: es })}
      </div>
    },
  },
  {
    accessorKey: "accounting_account",
    header: "Cuenta contable",
    cell: ({ row }) => {
      if (row.original.id < 0) return <div>&nbsp;</div>
      return <Button
        variant="link"
        className="p-0 h-auto text-foreground"
        asChild
      >
        <Link href={routes.chartOfAccounts.detail(row.original.accounting_account.id)} target="_blank">
          {row.original?.accounting_account?.name}
        </Link>
      </Button>
    },
  },
  {
    accessorKey: "costs_center",
    header: "Centro de costos",
    cell: ({ row }) => <div className="truncate">{row?.original?.costs_center?.name}</div>,
  },
  {
    accessorKey: "invoiced_amount",
    header: "Monto facturado",
    cell: ({ row }) => <div className={cn("truncate", row?.original?.id === -1 ? "font-semibold" : "")}>
      {row?.original?.currency?.name}{" "}
      {row.original.invoiced_amount === null ? "" : formatNumber(row.original.invoiced_amount)}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row?.original?.invoiced_amount),
        0
      );
      return <span className="font-semibold">
        COP{" "}
        {formatNumber(total)}
      </span>
    }
  },
  {
    accessorKey: "paid_amount",
    header: "Monto pagado",
    cell: ({ row }) => <div className={cn("truncate", row?.original?.id === -1 ? "font-semibold" : "")}>
      {row?.original?.currency?.name}{" "}
      {row.original.paid_amount === null ? "" : formatNumber(row.original.paid_amount)}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row?.original?.paid_amount),
        0
      );
      return <span className="font-semibold">
        COP{" "}
        {total.toFixed(2)}
      </span>
    }
  },
  {
    accessorKey: "outstanding_amount",
    header: "Monto pendiente",
    cell: ({ row }) => <div className={cn("truncate", row?.original?.id === -1 ? "font-semibold" : "")}>
      {row?.original?.currency?.name}{" "}
      {row.original.outstanding_amount === null ? "" : formatNumber(row.original.outstanding_amount)}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row?.original?.outstanding_amount),
        0
      );
      return <span className="font-semibold">
        COP{" "}
        {formatNumber(total)}
      </span>
    }
  },
  {
    accessorKey: "30_days",
    header: "30 días",
    cell: ({ row }) => <div className={cn("truncate", row?.original?.id === -1 ? "font-semibold" : "")}>
      {row?.original?.currency?.name}{" "}
      {row?.original?.["30_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row?.original?.["30_days"]),
        0
      );
      return <span className="font-semibold">
        COP{" "}
        {formatNumber(total)}
      </span>
    }
  },
  {
    accessorKey: "60_days",
    header: "60 días",
    cell: ({ row }) => <div className={cn("truncate", row?.original?.id === -1 ? "font-semibold" : "")}>
      {row?.original?.currency?.name}{" "}
      {row?.original?.["60_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row?.original?.["60_days"]),
        0
      );
      return <span className="font-semibold">
        COP{" "}
        {formatNumber(total)}
      </span>
    }
  },
  {
    accessorKey: "90_days",
    header: "90 días",
    cell: ({ row }) => <div className={cn("truncate", row?.original?.id === -1 ? "font-semibold" : "")}>
      {row?.original?.currency?.name}{" "}
      {row?.original?.["90_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row?.original?.["90_days"]),
        0
      );
      return <span className="font-semibold">
        COP{" "}
        {formatNumber(total)}
      </span>
    }
  },
  {
    accessorKey: "120_days",
    header: "120 días",
    cell: ({ row }) => <div className={cn("truncate", row?.original?.id === -1 ? "font-semibold" : "")}>
      {row?.original?.currency?.name}{" "}
      {row?.original?.["120_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row?.original?.["120_days"]),
        0
      );
      return <span className="font-semibold">
        COP{" "}
        {formatNumber(total)}
      </span>
    }
  },
  {
    accessorKey: "120+_days",
    header: "120+ días",
    cell: ({ row }) => <div className={cn("truncate", row?.original?.id === -1 ? "font-semibold" : "")}>
      {row?.original?.currency?.name}{" "}
      {row?.original?.["120+_days"]}
    </div>,
    footer: ({ table }) => {
      const total = table.getRowModel().rows.reduce(
        (sum, row) => sum + Number(row?.original?.["120+_days"]),
        0
      );
      return <span className="font-semibold">
        COP{" "}
        {formatNumber(total)}
      </span>
    }
  },
]