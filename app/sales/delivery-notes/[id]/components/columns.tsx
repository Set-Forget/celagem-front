'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PurchaseReceiptItems } from '../../schemas/delivery-notes';

export const columns: ColumnDef<PurchaseReceiptItems>[] = [
    {
        accessorKey: 'item_code',
        header: 'Código',
        cell: ({ row }) => <div>{row.getValue('item_code')}</div>,
    },
    {
        accessorKey: 'received_quantity',
        header: 'Cantidad recibida',
        cell: ({ row }) => {
            return <div>{row.getValue('received_quantity')}</div>;
        },
    },
    {
        accessorKey: 'item_name',
        header: 'Nombre',
        cell: ({ row }) => {
            return <div>{row.getValue('item_name')}</div>;
        },
    },
    {
        accessorKey: 'description',
        header: 'Descripción',
        cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: () => {
            return <></>;
        },
    },
];
