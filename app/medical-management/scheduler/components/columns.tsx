"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ColumnDef
} from "@tanstack/react-table";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ban, MoreHorizontal } from "lucide-react";
import { appointment_states, modes_of_care } from "../adapters/appointments";
import { AppointmentList } from "../schemas/appointments";

export const columns: ColumnDef<AppointmentList>[] = [
  {
    accessorKey: "doctor_id",
    header: "Profesional",
    cell: ({ row }) => <div className="font-medium">{row.getValue("doctor_id")}</div>,
  },
  {
    accessorKey: "patient_id",
    header: "Paciente",
    cell: ({ row }) => <div>{row.getValue("patient_id")}</div>,
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
          <span className="font-medium">{formattedDate}</span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = appointment_states[row.getValue("status") as keyof typeof appointment_states]

      return <Badge
        variant="custom"
        className={cn(`${status.bg_color} ${status.text_color} border-none rounded-sm`)}
      >
        {status.label}
      </Badge>
    },
  },
  {
    accessorKey: "mode_of_care",
    header: "Modo de atención",
    cell: ({ row }) => {
      const modeOfCare = modes_of_care[row.getValue("mode_of_care") as keyof typeof modes_of_care]
      return <span className="text-sm">{modeOfCare.label}</span>
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={e => e.stopPropagation()}
              className="text-destructive focus:text-destructive"
            >
              <Ban />
              Cancelar turno
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]