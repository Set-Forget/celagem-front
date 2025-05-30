'use client'

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListAccountsReceivableQuery } from "@/lib/services/accounts-receivable";
import { cn } from "@/lib/utils";
import '@tanstack/react-table';
import {
  Column,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowLeftToLineIcon, ArrowRightToLineIcon, EllipsisIcon, Loader2, PinOffIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { CSSProperties, useMemo } from "react";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import { AccountsReceivableList } from "./schemas/accounts-receivable";
import { groupByCustomer } from "./utils";

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    forceFooterPosition?: number;
  }
}

export default function AccountsReceivablePage() {
  const searchParams = useSearchParams()

  const date_range = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }
  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: accountsReceivable, isLoading: isAccountsReceivableLoading } = useListAccountsReceivableQuery();

  const issueDateStart = date_range.field === "date" ? date_range.from.slice(0, 10) : undefined;
  const issueDateEnd = date_range.field === "date" ? date_range.to.slice(0, 10) : undefined;

  const dueDateStart = date_range.field === "due_date" ? date_range.from.slice(0, 10) : undefined;
  const dueDateEnd = date_range.field === "due_date" ? date_range.to.slice(0, 10) : undefined;

  const memoizedData = useMemo(() => {
    const list = accountsReceivable?.data ?? []
    return groupByCustomer(
      list
        .filter(item => {
          if (!issueDateStart && !issueDateEnd) return true;
          const recordDate = item.date.split("T")[0];
          if (issueDateStart && recordDate < issueDateStart) return false;
          if (issueDateEnd && recordDate > issueDateEnd) return false;
          return true;
        })
        .filter(item => {
          if (!dueDateStart && !dueDateEnd) return true;
          const recordDate = item.due_date.split("T")[0];
          if (dueDateStart && recordDate < dueDateStart) return false;
          if (dueDateEnd && recordDate > dueDateEnd) return false;
          return true;
        })
        .filter(item => {
          if (!search.field || !search.query) return true
          const q = search.query.toLowerCase()
          switch (search.field) {
            case "customer": return item.customer?.toLowerCase().includes(q)
            case "voucher_number": return String(item.voucher_number).includes(q)
            case "costs_center": return item.costs_center?.toLowerCase().includes(q)
            default: return false
          }
        })
    )
  }, [
    accountsReceivable?.data,
    date_range.field,
    date_range.from,
    date_range.to,
    search.field,
    search.query,
  ])

  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  const getPinningStyles = (column: Column<AccountsReceivableList>): CSSProperties => {
    const isPinned = column.getIsPinned();
    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
  };

  return (
    <div>
      <Header title="Cuentas por cobrar" />
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-197px)] [&_*[data-table='true']]:w-[calc(100svw-306px)]">
        <div className="space-y-4 flex flex-col justify-between">
          <Toolbar table={table} />
          <div className="overflow-hidden rounded-sm border border-border bg-background shadow-sm">
            <Table
              className="[&_td]:border-border [&_th]:border-border table-fixed border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
              style={{
                width: table.getTotalSize(),
              }}
            >
              <TableHeader className="sticky top-0 z-10 bg-accent/90 backdrop-blur-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/50">
                    {headerGroup.headers.map((header) => {
                      const { column } = header;
                      const isPinned = column.getIsPinned();
                      const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
                      const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right");

                      return (
                        <TableHead
                          key={header.id}
                          className="[&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-muted/90 relative h-10 truncate [&[data-pinned]]:backdrop-blur-sm [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l"
                          colSpan={header.colSpan}
                          style={{ ...getPinningStyles(column) }}
                          data-pinned={isPinned || undefined}
                          data-last-col={
                            isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
                          }
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate">
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            {!header.isPlaceholder &&
                              header.column.getCanPin() &&
                              (header.column.getIsPinned() ? (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="-mr-1 size-7 shadow-none"
                                  onClick={() => header.column.pin(false)}
                                  aria-label={`Unpin ${header.column.columnDef.header as string} column`}
                                  title={`Unpin ${header.column.columnDef.header as string} column`}
                                >
                                  <PinOffIcon className="opacity-60" size={16} aria-hidden="true" />
                                </Button>
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="-mr-1 size-7 shadow-none"
                                      aria-label={`Pin options for ${header.column.columnDef.header as string} column`}
                                      title={`Pin options for ${header.column.columnDef.header as string} column`}
                                    >
                                      <EllipsisIcon className="opacity-60" size={16} aria-hidden="true" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => header.column.pin("left")}>
                                      <ArrowLeftToLineIcon
                                        size={16}
                                        className="opacity-60"
                                        aria-hidden="true"
                                      />
                                      Fijar a la izquierda
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => header.column.pin("right")}>
                                      <ArrowRightToLineIcon
                                        size={16}
                                        className="opacity-60"
                                        aria-hidden="true"
                                      />
                                      Fijar a la derecha
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ))}
                            {header.column.getCanResize() && (
                              <div
                                {...{
                                  onDoubleClick: () => header.column.resetSize(),
                                  onMouseDown: header.getResizeHandler(),
                                  className:
                                    "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
                                }}
                              />
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isAccountsReceivableLoading &&
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
                {!table?.getRowModel()?.rows?.length && !isAccountsReceivableLoading && (
                  <TableRow className="border-none">
                    <TableCell
                      colSpan={columns.length}
                      className="text-xs text-center h-10 border-b text-muted-foreground"
                    >
                      No hay items
                    </TableCell>
                  </TableRow>
                )}
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => {
                      const { column, row } = cell;
                      const isPinned = column.getIsPinned();
                      const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
                      const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right");

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn("[&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-background/90 truncate [&[data-pinned]]:backdrop-blur-sm [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l", row.original.id === -1 && "bg-accent")}
                          style={{ ...getPinningStyles(column) }}
                          data-pinned={isPinned || undefined}
                          data-last-col={
                            isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className={cn("sticky bottom-0 z-10 bg-accent/90 backdrop-blur-sm", accountsReceivable?.data?.length === 0 || isAccountsReceivableLoading && "hidden")}>
                {table.getFooterGroups().map((footerGroup) => (
                  <TableRow key={footerGroup.id}>
                    {footerGroup.headers.map((header) => {
                      const { column } = header;
                      const isPinned = column.getIsPinned();
                      const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
                      const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right");
                      return (
                        <TableCell
                          key={header.id}
                          style={{ ...getPinningStyles(column) }}
                          data-pinned={isPinned || undefined}
                          data-last-col={
                            isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
                          }
                          className="[&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-accent/90 [&[data-pinned]]:backdrop-blur-sm [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.footer, header.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableFooter>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <div className="flex grow justify-start whitespace-nowrap text-sm text-muted-foreground">
              <p className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
                Mostrando{" "}
                <span className="text-foreground">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                  {Math.min(
                    Math.max(
                      table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                      table.getState().pagination.pageSize,
                      0,
                    ),
                    table.getRowCount(),
                  )}
                </span>{" "}
                de{" "}<span className="text-foreground">{table.getRowCount().toString()}</span>
                {" "}resultados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}