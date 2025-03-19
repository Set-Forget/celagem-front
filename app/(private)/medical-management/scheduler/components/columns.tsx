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
import { Ban, MoreHorizontal, SquarePen } from "lucide-react";
import { AppointmentList } from "../schemas/appointments";
import { appointmentStates, modesOfCare } from "../utils";
import { setDialogsState } from "@/lib/store/dialogs-store";

export const columns: ColumnDef<AppointmentList>[] = [
  {
    accessorKey: "doctor.id",
    header: "Profesional",
    cell: ({ row }) =>
      <span className="font-medium">
        {row.original.doctor.first_name} {row.original.doctor.last_name}
      </span>
  },
  {
    accessorKey: "patient.id",
    header: "Paciente",
    cell: ({ row }) => <div>{row.original.patient.first_name} {row.original.patient.last_name}</div>,
  },
  {
    accessorKey: "start_date",
    header: "Fecha",
    sortingFn: (rowA, rowB) => {
      const a = new Date(`${rowA.original.start_date}T${rowA.original.start_time}`);
      const b = new Date(`${rowB.original.start_date}T${rowB.original.start_time}`);
      return b.getTime() - a.getTime();
    },
    cell: ({ row }) => {
      const startDateTime = new Date(`${row.original.start_date}T${row.original.start_time}`);
      const endDateTime = new Date(`${row.original.start_date}T${row.original.end_time}`);

      const formattedDate = format(startDateTime, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
      const formattedTime = `${format(startDateTime, 'hh:mm aaa', { locale: es })} a ${format(endDateTime, 'hh:mm aaa', { locale: es })}`;

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
      const status = appointmentStates[row.getValue("status") as keyof typeof appointmentStates]

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
      const modeOfCare = modesOfCare[row.original.mode_of_care as keyof typeof modesOfCare]
      return <span className="text-sm">{modeOfCare}</span>
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
              onClick={e => {
                e.stopPropagation()
                setDialogsState({ open: "edit-appointment", payload: { appointment: row.original } })
              }}
            >
              <SquarePen />
              Editar turno
            </DropdownMenuItem>
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