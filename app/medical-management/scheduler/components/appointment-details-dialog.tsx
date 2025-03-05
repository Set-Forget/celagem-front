import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState as setMasterDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { useUpdateAppointmentMutation } from "@/lib/services/appointments";
import { format, formatISO, parse } from "date-fns";
import { es } from "date-fns/locale";
import { Ban, Hospital, Loader2, MapPin, Microscope, Pencil, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { AppointmentList } from "../schemas/appointments";
import { appointmentStates, modesOfCare } from "../utils";
import { useRouter } from "next/navigation";


export default function AppointmentDetailsDialog() {
  const router = useRouter()

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const appointment = dialogState?.payload?.appointment as AppointmentList

  const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation()

  const startDateTimeISO = appointment ? formatISO(parse(`${appointment?.start_date} ${appointment?.start_time}`, 'yyyy-MM-dd HH:mm', new Date())) : '';
  const endDateTimeISO = appointment ? formatISO(parse(`${appointment?.end_date} ${appointment?.end_time}`, 'yyyy-MM-dd HH:mm', new Date())) : '';

  const onOpenChange = () => {
    closeDialogs()
  }

  const handleUpdateAppointment = async () => {
    try {
      const response = await updateAppointment({
        id: appointment?.id as string,
        body: { status_id: 3 }
      })

      if (response.data?.status === 'SUCCESS') {
        closeDialogs()
      }
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
      onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] gap-6">
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2">
            <DialogTitle>
              {appointment?.patient?.first_name} {appointment?.patient?.last_name}
            </DialogTitle>
            <Badge
              variant="custom"
              className={
                cn(
                  appointmentStates[appointment?.status as keyof typeof appointmentStates]?.bg_color,
                  appointmentStates[appointment?.status as keyof typeof appointmentStates]?.text_color
                )}
            >
              {appointmentStates[appointment?.status as keyof typeof appointmentStates]?.label}
            </Badge>
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
            <Hospital className="h-5 w-5" />
            <span className="text-sm">
              {appointment?.clinic_id}
            </span>
          </div>
          <div className="flex gap-2">
            <Stethoscope className="h-5 w-5" />
            <span className="text-sm">
              Dr. {appointment?.doctor?.first_name} {appointment?.doctor?.last_name}
            </span>
          </div>
          <div className="flex gap-2">
            <MapPin className="h-5 w-5" />
            <span className="text-sm">
              {modesOfCare[appointment?.mode_of_care as keyof typeof modesOfCare]}
            </span>
          </div>
          <div className="flex gap-2">
            <Microscope className="h-5 w-5" />
            <span className="text-sm">
              {appointment?.care_type}
            </span>
          </div>
        </div>
        <div className="flex gap-2 bg-muted border p-2 rounded-sm">
          <span className="text-xs">
            {appointment?.notes || 'No se adjuntaron notas a este turno.'}
          </span>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            disabled={isLoading || appointment?.status === "CANCELLED"}
            onClick={handleUpdateAppointment}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Ban />}
            Cancelar
          </Button>
          <div className="flex gap-2">
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
                router.push(`/medical-management/scheduler/appointment/${appointment?.id}`)
              }}
            >
              Iniciar visita
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}