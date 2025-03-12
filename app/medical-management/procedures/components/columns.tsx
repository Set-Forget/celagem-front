'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { PURCHASE_ORDER_STATUS } from '../adapters/customers';
import { PurchaseOrderList } from '../schemas/procedures';

const PercentageReceivedCell = ({ row }: { row: Row<PurchaseOrderList> }) => {
    const percentageReceived = row.original.percentage_received;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Progress value={percentageReceived} />
                </TooltipTrigger>
                <TooltipContent>{percentageReceived.toFixed()}%</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export const columns: ColumnDef<PurchaseOrderList>[] = [
    {
        accessorKey: 'number',
        header: 'Número',
        cell: ({ row }) => (
            <div className="font-medium">{row.original.number}</div>
        ),
    },
    {
        accessorKey: 'supplier',
        header: 'Proveedor',
        cell: ({ row }) => <div>{row.original.supplier}</div>,
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
            const status =
                PURCHASE_ORDER_STATUS[
                    row.getValue('status') as keyof typeof PURCHASE_ORDER_STATUS
                ];
            return (
                <Badge
                    variant="custom"
                    className={cn(
                        `${status?.bg_color} ${status?.text_color} border-none`
                    )}
                >
                    {status?.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'percentage_received',
        header: 'Porcentaje recibido',
        cell: ({ row }) => <PercentageReceivedCell row={row} />,
    },
    {
        accessorKey: 'price',
        header: 'Total',
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.currency} {row.original.price}
            </div>
        ),
    },
    {
        accessorKey: 'required_date',
        header: 'Fecha de requerimiento',
        cell: ({ row }) => (
            <div>
                {format(new Date(row.original.required_date), 'dd MMM yyyy')}
            </div>
        ),
    },
];
