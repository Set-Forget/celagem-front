"use client"

import { Badge } from "@/components/ui/badge";
import {
  ColumnDef
} from "@tanstack/react-table";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { APPOINTMENT_STATUSES } from "../adapters/appointments";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "professional",
    header: "Profesional",
    cell: ({ row }) => <div className="font-medium">{row.getValue("professional")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = APPOINTMENT_STATUSES[row.getValue("status") as keyof typeof APPOINTMENT_STATUSES]

      return <Badge
        variant="outline"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
      >
        {status.label}
      </Badge>
    },
  },
  {
    accessorKey: "patient",
    header: "Paciente",
    cell: ({ row }) => <div>{row.getValue("patient")}</div>,
  },
  {
    accessorKey: "start_date",
    header: "Fecha",
    cell: ({ row }) => {
      const startDateTime = new Date(`${row.original.start_date}T${row.original.start_time}`);
      const endDateTime = new Date(`${row.original.start_date}T${row.original.end_time}`);

      const formattedDate = format(startDateTime, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
      const formattedTime = `${format(startDateTime, 'hh:mmaaa', { locale: es })} a ${format(endDateTime, 'hh:mmaaa', { locale: es })}`;

      return (
        <div className="flex flex-col">
          <div>{formattedDate}</div>
          <div className="text-xs text-muted-foreground">{formattedTime}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "headquarters",
    header: "Sede",
    cell: ({ row }) => <div>{row.getValue("headquarters")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <></>
      )
    },
  },
]