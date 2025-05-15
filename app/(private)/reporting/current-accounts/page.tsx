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
import { cn } from "@/lib/utils";
import {
  Column,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { ArrowLeftToLineIcon, ArrowRightToLineIcon, EllipsisIcon, Loader2, PinOffIcon } from "lucide-react";
import { CSSProperties, useMemo, useState } from "react";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import '@tanstack/react-table';
import { useListAccountsPayableQuery } from "@/lib/services/accounts-payable";
import { CurrentAccountsList } from "./schemas/current-accounts";

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    forceFooterPosition?: number;
  }
}

function groupByPartner(accounts?: CurrentAccountsList[]): CurrentAccountsList[] {
  const groups: { [partner: string]: CurrentAccountsList[] } = {};
  accounts?.forEach((item) => {
    const partner = item.partner;
    if (!groups[partner]) {
      groups[partner] = [];
    }
    groups[partner].push(item);
  });

  const result: CurrentAccountsList[] = [];
  Object.keys(groups).forEach((partner) => {
    const items = groups[partner];

    items.forEach((item) => result.push(item));

    const totalDebit = items.reduce((sum, item) => sum + Number(item.debit), 0);
    const totalCredit = items.reduce((sum, item) => sum + Number(item.credit), 0);
    const totalBalance = items.reduce((sum, item) => sum + Number(item.balance), 0);

    const totalRow: CurrentAccountsList = {
      id: -1,
      date: "",
      partner,
      account: "",
      ref: "",
      debit: totalDebit,
      credit: totalCredit,
      balance: totalBalance,
      currency: items[0].currency,
    };

    result.push(totalRow);

    const emptyRow: CurrentAccountsList = {
      id: -2,
      date: "",
      partner: "",
      account: "",
      ref: "",
      debit: null,
      credit: null,
      balance: null,
      currency: "",
    };

    result.push(emptyRow);
  });

  return result;
}

const data: CurrentAccountsList[] = [
  { id: 1, date: "2024-03-01", partner: "ACME Corp", account: "Cuenta por cobrar", ref: "FAC-0001", debit: 1200.00, credit: 0.00, balance: 1200.00, currency: "USD" },
  { id: 2, date: "2024-03-02", partner: "Globex SA", account: "Cuenta por pagar", ref: "REC-2001", debit: 0.00, credit: 800.00, balance: 400.00, currency: "USD" },
  { id: 3, date: "2024-03-03", partner: "ACME Corp", account: "Cuenta por pagar", ref: "NC-1001", debit: 0.00, credit: 200.00, balance: 1000.00, currency: "USD" },
  { id: 4, date: "2024-03-04", partner: "Soylent Ltd", account: "Cuenta por cobrar", ref: "FAC-0002", debit: 1500.00, credit: 0.00, balance: 1500.00, currency: "ARS" },
  { id: 5, date: "2024-03-05", partner: "Initech", account: "Cuenta por cobrar", ref: "FAC-0003", debit: 500.00, credit: 0.00, balance: 2000.00, currency: "ARS" },
  { id: 6, date: "2024-03-06", partner: "Globex SA", account: "Cuenta por pagar", ref: "REC-2002", debit: 0.00, credit: 300.00, balance: 1700.00, currency: "ARS" },
  { id: 7, date: "2024-03-07", partner: "ACME Corp", account: "Cuenta por cobrar", ref: "FAC-0004", debit: 750.00, credit: 0.00, balance: 2450.00, currency: "USD" },
  { id: 8, date: "2024-03-08", partner: "Umbrella Inc", account: "Cuenta por pagar", ref: "NC-1002", debit: 0.00, credit: 450.00, balance: 2000.00, currency: "USD" },
  { id: 9, date: "2024-03-09", partner: "Initech", account: "Cuenta por cobrar", ref: "FAC-0005", debit: 650.00, credit: 0.00, balance: 2650.00, currency: "ARS" },
  { id: 10, date: "2024-03-10", partner: "Globex SA", account: "Cuenta por cobrar", ref: "FAC-0006", debit: 900.00, credit: 0.00, balance: 2950.00, currency: "USD" },
  { id: 11, date: "2024-03-11", partner: "Soylent Ltd", account: "Cuenta por pagar", ref: "REC-2003", debit: 0.00, credit: 1000.00, balance: 1950.00, currency: "USD" },
  { id: 12, date: "2024-03-12", partner: "ACME Corp", account: "Cuenta por cobrar", ref: "FAC-0007", debit: 1200.00, credit: 0.00, balance: 3150.00, currency: "USD" },
  { id: 13, date: "2024-03-13", partner: "Initech", account: "Cuenta por pagar", ref: "NC-1003", debit: 0.00, credit: 150.00, balance: 3000.00, currency: "ARS" },
  { id: 14, date: "2024-03-14", partner: "Globex SA", account: "Cuenta por cobrar", ref: "FAC-0008", debit: 450.00, credit: 0.00, balance: 3450.00, currency: "USD" },
  { id: 15, date: "2024-03-15", partner: "Umbrella Inc", account: "Cuenta por pagar", ref: "REC-2004", debit: 0.00, credit: 500.00, balance: 2950.00, currency: "ARS" },
  { id: 16, date: "2024-03-16", partner: "Soylent Ltd", account: "Cuenta por cobrar", ref: "FAC-0009", debit: 700.00, credit: 0.00, balance: 3650.00, currency: "ARS" },
  { id: 17, date: "2024-03-17", partner: "Initech", account: "Cuenta por pagar", ref: "NC-1004", debit: 0.00, credit: 300.00, balance: 3350.00, currency: "ARS" },
  { id: 18, date: "2024-03-18", partner: "Globex SA", account: "Cuenta por cobrar", ref: "FAC-0010", debit: 1000.00, credit: 0.00, balance: 4350.00, currency: "USD" },
  { id: 19, date: "2024-03-19", partner: "ACME Corp", account: "Cuenta por pagar", ref: "REC-2005", debit: 0.00, credit: 850.00, balance: 3500.00, currency: "USD" },
  { id: 20, date: "2024-03-20", partner: "Soylent Ltd", account: "Cuenta por cobrar", ref: "FAC-0011", debit: 400.00, credit: 0.00, balance: 3900.00, currency: "ARS" },
];

export default function Page() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const memoizedData = useMemo(() => groupByPartner(data), [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    enableSortingRemoval: false,
  });

  const getPinningStyles = (column: Column<CurrentAccountsList>): CSSProperties => {
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
      <Header title="Cuentas corrientes" />
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-197px)] [&_*[data-table='true']]:w-[calc(100svw-306px)]">
        <div className="space-y-4 flex flex-col justify-between">
          <Toolbar table={table} />
          <div className="overflow-hidden rounded-sm border border-border bg-background shadow-sm">
            <Table
              className="min-w-full [&_td]:border-border [&_th]:border-border table-fixed border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
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
                {false &&
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
                {!table?.getRowModel()?.rows?.length && !false && (
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
              <TableFooter className={cn("sticky bottom-0 z-10 bg-accent/90 backdrop-blur-sm", data?.length === 0 || false && "hidden")}>
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