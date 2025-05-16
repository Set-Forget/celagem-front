"use client"

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"
import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { columns } from "./columns"

const data: any[] = [
  {
    "date": "2024-02-14",
    "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
    "debit": 2500.45,
    "credit": 0,
    "balance": 8200.55,
    "cost_center": "Operaciones"
  },
  {
    "date": "2023-12-05",
    "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
    "debit": 0,
    "credit": 1800.00,
    "balance": 6400.55,
    "cost_center": "Administración"
  },
  {
    "date": "2024-01-10",
    "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
    "debit": 3200.00,
    "credit": 0,
    "balance": 9600.55,
    "cost_center": "Ventas"
  },
  {
    "date": "2023-11-25",
    "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
    "debit": 0,
    "credit": 1200.00,
    "balance": 8400.55,
    "cost_center": "Producción"
  },
  {
    "date": "2024-03-12",
    "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
    "debit": 1000.00,
    "credit": 0,
    "balance": 9400.55,
    "cost_center": "Operaciones"
  },
  {
    "date": "2024-02-20",
    "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
    "debit": 0,
    "credit": 1500.00,
    "balance": 7900.55,
    "cost_center": "Administración"
  },
  {
    "date": "2024-01-18",
    "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
    "debit": 500.00,
    "credit": 0,
    "balance": 8400.55,
    "cost_center": "Ventas"
  },
  {
    "date": "2023-12-30",
    "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
    "debit": 0,
    "credit": 300.00,
    "balance": 8100.55,
    "cost_center": "Producción"
  }
]


const PAGE_SIZE = 15

export function GeneralLedgerItemsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: PAGE_SIZE,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-col">
      <div className="rounded-sm border flex flex-col">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn("border-b")}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="border-t-0">
            <TableRow>
              <TableCell colSpan={columns.length - 4} className="h-6 text-xs font-medium py-0 rounded-bl-sm">
                <span>Total</span>
              </TableCell>
              <TableCell className="h-6 text-xs font-medium py-0">
                <span>ARS 17,000.00</span>
              </TableCell>
              <TableCell className="h-6 text-xs font-medium py-0">
                <span>ARS 17,000.00</span>
              </TableCell>
              <TableCell className="h-6 text-xs font-medium py-0">
                <span>ARS 17,000.00</span>
              </TableCell>
              <TableCell className="rounded-br-sm"></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
