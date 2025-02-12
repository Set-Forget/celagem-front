"use client"

import { cn, placeholder } from "@/lib/utils"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import * as React from "react"
import { Button } from "./ui/button"
import { Table as ShadcnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: boolean
  loading?: boolean
  loadingRows?: number
  onRowClick?: (row: TData) => void
  toolbar?: (props: { table: Table<TData> }) => React.ReactNode
  footer?: () => React.ReactNode
}

const PAGE_SIZE = 20

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  loadingRows,
  pagination = true,
  onRowClick,
  toolbar,
  footer,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: PAGE_SIZE,
      },
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4 flex flex-col justify-between">
      {toolbar && toolbar({ table })}
      <div className="overflow-hidden rounded-sm border border-border bg-background">
        <ShadcnTable className="[&_td]:border-border [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
          <TableHeader className="sticky top-0 z-10 bg-accent/90 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-b" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="h-9" key={header.id} colSpan={header.colSpan}>
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
            {loading &&
              <TableRow className="border-none">
                <TableCell
                  colSpan={columns.length}
                  className="text-xs text-center h-10 border-b"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin" size={14} />
                    Cargando...
                  </div>
                </TableCell>
              </TableRow>
            }
            {!table?.getRowModel()?.rows?.length && !loading && (
              <TableRow className="border-none">
                <TableCell
                  colSpan={columns.length}
                  className="text-xs text-center h-10 border-b"
                >
                  No hay items
                </TableCell>
              </TableRow>
            )}
            {table?.getRowModel()?.rows?.length > 0 && table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn("h-10", onRowClick && "cursor-pointer")}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick?.(row.original)}
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
            ))}
          </TableBody>
          {footer && footer()}
        </ShadcnTable>
      </div>
      {pagination && (
        <div className="flex items-center justify-end space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando {table.getRowModel().rows.length} de {table.getRowCount()} items.
          </div>
          <div className="space-x-2 flex items-center">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} de{" "}
                {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
              </div>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}