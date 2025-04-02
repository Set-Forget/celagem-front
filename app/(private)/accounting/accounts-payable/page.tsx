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
import { AccountsPayableList } from "./schemas/accounts-payable";
import '@tanstack/react-table';
import { useListAccountsPayableQuery } from "@/lib/services/accounts-payable";

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    forceFooterPosition?: number;
  }
}

function groupBySupplier(accounts?: AccountsPayableList[]): AccountsPayableList[] {
  const groups: { [supplier: string]: AccountsPayableList[] } = {};
  accounts?.forEach((item) => {
    const supplier = item.customer;
    if (!groups[supplier]) {
      groups[supplier] = [];
    }
    groups[supplier].push(item);
  });

  const result: AccountsPayableList[] = [];
  Object.keys(groups).forEach((supplier) => {
    const items = groups[supplier];

    items.forEach((item) => result.push(item));

    const totalInvoiced = items.reduce((sum, item) => sum + Number(item.invoiced_amount), 0);
    const totalPaid = items.reduce((sum, item) => sum + Number(item.paid_amount), 0);
    const totalOutstanding = items.reduce((sum, item) => sum + Number(item.outstanding_amount), 0);
    const total30Days = items.reduce((sum, item) => sum + Number(item["30_days"]), 0);
    const total60Days = items.reduce((sum, item) => sum + Number(item["60_days"]), 0);
    const total90Days = items.reduce((sum, item) => sum + Number(item["90_days"]), 0);
    const total120Days = items.reduce((sum, item) => sum + Number(item["120_days"]), 0);
    const total120PlusDays = items.reduce((sum, item) => sum + Number(item["120+_days"]), 0);

    const totalRow: AccountsPayableList = {
      id: -1,
      date: "",
      customer: supplier,
      accounting_account: "",
      costs_center: "",
      voucher_type: "",
      voucher_number: "",
      due_date: "",
      invoiced_amount: parseFloat(totalInvoiced.toFixed(2)),
      paid_amount: parseFloat(totalPaid.toFixed(2)),
      outstanding_amount: parseFloat(totalOutstanding.toFixed(2)),
      currency: items[0].currency,
      "30_days": parseFloat(total30Days.toFixed(2)),
      "60_days": parseFloat(total60Days.toFixed(2)),
      "90_days": parseFloat(total90Days.toFixed(2)),
      "120_days": parseFloat(total120Days.toFixed(2)),
      "120+_days": parseFloat(total120PlusDays.toFixed(2)),
    };

    result.push(totalRow);

    const emptyRow: AccountsPayableList = {
      id: -2,
      date: "",
      customer: "",
      accounting_account: "",
      costs_center: "",
      voucher_type: "",
      voucher_number: "",
      due_date: "",
      invoiced_amount: null,
      paid_amount: null,
      outstanding_amount: null,
      currency: "",
      "30_days": null,
      "60_days": null,
      "90_days": null,
      "120_days": null,
      "120+_days": null,
    };

    result.push(emptyRow);
  });

  return result;
}

export default function AccountsReceivablePage() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: accountsPayable, isLoading: isAccountsPayableLoading } = useListAccountsPayableQuery();

  const memoizedData = useMemo(() => groupBySupplier(accountsPayable?.data), [accountsPayable]);
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

  const getPinningStyles = (column: Column<AccountsPayableList>): CSSProperties => {
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
    <>
      <Header title="Cuentas por pagar" />
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
                {isAccountsPayableLoading &&
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
                {!table?.getRowModel()?.rows?.length && !isAccountsPayableLoading && (
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
              <TableFooter className={cn("sticky bottom-0 z-10 bg-accent/90 backdrop-blur-sm", accountsPayable?.data?.length === 0 || isAccountsPayableLoading && "hidden")}>
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
    </>
  )
}