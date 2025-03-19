import StatusDot from "@/components/status-dot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetAppointmentQuery, useUpdateAppointmentMutation } from "@/lib/services/appointments";
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState as setMasterDialogsState } from "@/lib/store/dialogs-store";
import { cn, placeholder } from "@/lib/utils";
import { format, formatISO, parse } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, Hospital, MapPin, Microscope, Pencil, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appointmentStates, modesOfCare } from "../utils";
import { useGetTemplateQuery } from "@/lib/services/templates";

export default function AppointmentDetailsDialog() {
  const router = useRouter()

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const appointmentId = dialogState?.payload?.appointment_id as string

  const { data: appointment, isFetching: isAppointmentFetching } = useGetAppointmentQuery(appointmentId, { skip: !appointmentId })
  const { data: template, isFetching: isTemplateFetching } = useGetTemplateQuery(appointment?.template_id as number, { skip: !appointment?.template_id })

  const [updateAppointment] = useUpdateAppointmentMutation()

  const startDateTimeISO = appointment ? formatISO(parse(`${appointment?.start_date} ${appointment?.start_time}`, 'yyyy-MM-dd HH:mm', new Date())) : '';
  const endDateTimeISO = appointment ? formatISO(parse(`${appointment?.end_date} ${appointment?.end_time}`, 'yyyy-MM-dd HH:mm', new Date())) : '';

  const onOpenChange = () => {
    closeDialogs()
  }

  const handleUpdateAppointment = async ({ status }: { status: "SCHEDULED" | "CANCELLED" }) => {
    try {
      await updateAppointment({
        id: appointment?.id as string,
        body: { status }
      }).unwrap()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Dialog
      open={dialogState.open === "appointment-details"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-[500px] gap-6">
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2">
            <DialogTitle className={cn("transition-all duration-300", isAppointmentFetching ? "blur-[4px]" : "blur-none")}>
              {isAppointmentFetching ? placeholder(12) : appointment?.patient?.first_name} {appointment?.patient?.last_name}
            </DialogTitle>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Badge
                  variant="custom"
                  className={
                    cn(
                      appointmentStates[appointment?.status as keyof typeof appointmentStates]?.bg_color,
                      appointmentStates[appointment?.status as keyof typeof appointmentStates]?.text_color
                    )}
                >
                  {appointmentStates[appointment?.status as keyof typeof appointmentStates]?.label}
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-32">
                <DropdownMenuItem
                  onSelect={() => handleUpdateAppointment({ status: "SCHEDULED" })}
                >
                  <StatusDot className="text-primary !h-2 !w-2 shadow-md rounded-full shadow-primary/50" />
                  <span>Pendiente</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleUpdateAppointment({ status: "CANCELLED" })}
                >
                  <StatusDot className="text-red-500 !h-2 !w-2 shadow-md rounded-full shadow-red-500/50" />
                  <span>Cancelado</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogDescription>
            {appointment && (() => {
              const start = new Date(startDateTimeISO);
              const end = new Date(endDateTimeISO);
              const isSameDay = start.toDateString() === end.toDateString();
              return isSameDay
                ? `${format(start, 'EEEE dd MMMM yyyy hh:mm a', { locale: es })} a ${format(end, 'hh:mm a', { locale: es })}`
                : `${format(start, 'EEEE dd MMMM yyyy hh:mm a', { locale: es })} a ${format(end, 'EEEE dd MMMM yyyy hh:mm a', { locale: es })}`;
            })()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex gap-2">
            <Hospital className="h-5 w-5 shrink-0" />
            <span className="text-sm">
              {appointment?.clinic?.name}
            </span>
          </div>
          <div className="flex gap-2">
            <Stethoscope className="h-5 w-5 shrink-0" />
            <span className="text-sm">
              Dr. {appointment?.doctor?.first_name} {appointment?.doctor?.last_name}
            </span>
          </div>
          <div className="flex gap-2">
            <MapPin className="h-5 w-5 shrink-0" />
            <span className="text-sm">
              {modesOfCare[appointment?.mode_of_care as keyof typeof modesOfCare]}
            </span>
          </div>
          <div className="flex gap-2">
            <Microscope className="h-5 w-5 shrink-0" />
            <span className={cn("text-sm transition-all duration-300", !template || isTemplateFetching ? "blur-[4px]" : "blur-none")}>
              {!template || isTemplateFetching ? placeholder(18) : template?.name || "No especificado"}
            </span>
          </div>
        </div>
        <div className="flex gap-2 bg-muted border p-2 rounded-sm">
          <span className="text-xs">
            {appointment?.notes || 'No se adjuntaron notas a este turno.'}
          </span>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => {
              setMasterDialogsState({ open: "edit-appointment", payload: { appointment } })
            }}
          >
            <Pencil />
          </Button>
          <Button
            size="sm"
            onClick={() => {
              closeDialogs()
              router.push(`/medical-management/visits/${appointment?.id}`)
            }}
          >
            Iniciar visita
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}