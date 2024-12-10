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
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { columns } from "./columns"
import Link from "next/link"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

const data = [
  {
    "receipt_mode": "bank_transfer",
    "receipt_date": "2023-10-12",
    "party_type": "customer",
    "amount": 3109.97,
    "transaction_id": 321461560092
  },
  {
    "receipt_mode": "cash",
    "receipt_date": "2023-10-24",
    "party_type": "customer",
    "amount": 6067.87,
    "transaction_id": 937998729354
  },
  {
    "receipt_mode": "check",
    "receipt_date": "2024-10-13",
    "party_type": "supplier",
    "amount": 3497.4,
    "transaction_id": 404915564883
  },
  {
    "receipt_mode": "credit_card",
    "receipt_date": "2023-03-21",
    "party_type": "customer",
    "amount": 8161.03,
    "transaction_id": 896999920591
  },
  {
    "receipt_mode": "credit_card",
    "receipt_date": "2023-08-02",
    "party_type": "customer",
    "amount": 2898.91,
    "transaction_id": 506372627775
  },
  {
    "receipt_mode": "bank_transfer",
    "receipt_date": "2023-07-26",
    "party_type": "customer",
    "amount": 6777.46,
    "transaction_id": 778034113674
  },
  {
    "receipt_mode": "credit_card",
    "receipt_date": "2024-06-07",
    "party_type": "customer",
    "amount": 1102.08,
    "transaction_id": 215870433114
  },
  {
    "receipt_mode": "check",
    "receipt_date": "2023-03-05",
    "party_type": "customer",
    "amount": 9099.49,
    "transaction_id": 463972900163
  },
  {
    "receipt_mode": "cash",
    "receipt_date": "2024-11-27",
    "party_type": "customer",
    "amount": 283.45,
    "transaction_id": 722326938750
  },
  {
    "receipt_mode": "bank_transfer",
    "receipt_date": "2024-08-22",
    "party_type": "supplier",
    "amount": 1412.05,
    "transaction_id": 187334280676
  },
  {
    "receipt_mode": "credit_card",
    "receipt_date": "2024-02-28",
    "party_type": "customer",
    "amount": 5640.78,
    "transaction_id": 831091194377
  },
  {
    "receipt_mode": "credit_card",
    "receipt_date": "2023-05-21",
    "party_type": "supplier",
    "amount": 4433.78,
    "transaction_id": 537443114338
  },
  {
    "receipt_mode": "debit_card",
    "receipt_date": "2023-03-30",
    "party_type": "supplier",
    "amount": 4112.49,
    "transaction_id": 503190929511
  },
  {
    "receipt_mode": "bank_transfer",
    "receipt_date": "2023-09-02",
    "party_type": "customer",
    "amount": 487.5,
    "transaction_id": 609216524074
  },
  {
    "receipt_mode": "debit_card",
    "receipt_date": "2023-07-26",
    "party_type": "supplier",
    "amount": 5349.95,
    "transaction_id": 151797173996
  },
  {
    "receipt_mode": "credit_card",
    "receipt_date": "2023-10-22",
    "party_type": "supplier",
    "amount": 439.91,
    "transaction_id": 410287534038
  },
  {
    "receipt_mode": "check",
    "receipt_date": "2023-07-27",
    "party_type": "supplier",
    "amount": 8461.42,
    "transaction_id": 358372750143
  },
  {
    "receipt_mode": "check",
    "receipt_date": "2024-11-01",
    "party_type": "supplier",
    "amount": 9915.78,
    "transaction_id": 810927211084
  },
  {
    "receipt_mode": "credit_card",
    "receipt_date": "2024-02-12",
    "party_type": "supplier",
    "amount": 6104.43,
    "transaction_id": 288780819788
  },
  {
    "receipt_mode": "credit_card",
    "receipt_date": "2024-03-25",
    "party_type": "customer",
    "amount": 5846.92,
    "transaction_id": 767921341703
  }
];

const PAGE_SIZE = 15

export function ReceiptsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 365),
  })

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
    <div className="flex flex-col h-full">
      <div className="flex items-center pb-4 justify-between">
        <div className="flex gap-4">
          <div className="flex gap-1">
            <Input
              placeholder="Buscar cobro..."
              value={(table.getColumn("transaction_id")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("transaction_id")?.setFilterValue(event.target.value)
              }
              className="max-w-xs py-0 h-8 rounded-tr-none rounded-br-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="min-w-8 h-8 rounded-tl-none rounded-bl-none"
            >
              <Search />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Columnas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {typeof column.columnDef.header === "string" && column.columnDef.header}
                      {typeof column.columnDef.header === "function" && column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                size="sm"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Seleccioná un rango</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          size="sm"
          asChild
        >
          <Link href="/banking/receipts/new">
            <Plus className="w-4 h-4" />
            Cargar Cobro
          </Link>
        </Button>
      </div>
      <div className="rounded-sm border h-[calc(100%-96px)]">
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
          <TableBody scrollBarClassName="pt-[42px]">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(table.getRowModel().rows.length === PAGE_SIZE && "last:!border-b-0")}
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
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de {table.getRowCount()} recibos.
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
    </div>
  )
}
