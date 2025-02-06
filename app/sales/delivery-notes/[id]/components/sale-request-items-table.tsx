'use client';

import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { columns } from './columns';
import { deliveryNoteItems } from '../../schemas/delivery-notes.js';

const data: deliveryNoteItems[] = [
    {
        item_code: 'ITEM-7882',
        item_name: 'Answer',
        description: 'Pattern tax these try dream.',
        delivered_quantity: 12,
        id: '7b140f23-e32b-4556-86c2-bedf237f43f5',
    },
    {
        item_code: 'ITEM-1814',
        item_name: 'Hear',
        description: 'Price cause debate leave situation result.',
        delivered_quantity: 1,
        id: '8ac65f9e-979f-4e54-b59d-0197511f7fd8',
    },
    {
        item_code: 'ITEM-2308',
        item_name: 'Seek',
        description: 'Subject collection young professor.',
        delivered_quantity: 35,
        id: '57515828-9775-4cf2-b37e-529aa5261dcd',
    },
    {
        item_code: 'ITEM-1691',
        item_name: 'Common',
        description: 'Bag challenge source two military.',
        delivered_quantity: 30,
        id: '5f04feb7-c416-4d2c-88f0-a3e8934ee033',
    },
    {
        item_code: 'ITEM-8413',
        item_name: 'Quite',
        description: 'Send full draw citizen air.',
        delivered_quantity: 47,
        id: 'e508cdfe-bcad-4c4c-9f3e-d6c5a27a20bb',
    },
];

const PAGE_SIZE = 5;

export function PurchaseRequestItemsTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: data ?? [],
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
    });

    return (
        <div className="flex flex-col h-full">
            <div className="rounded-sm border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            className="h-9"
                                            key={header.id}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody scrollBarClassName="pt-[42px]">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={cn(
                                        table.getRowModel().rows.length ===
                                            PAGE_SIZE &&
                                            '[&:nth-last-child(2)]:border-b-0'
                                    )}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
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
        </div>
    );
}
