import CustomSonner from "@/components/custom-sonner";
import StatusDot from "@/components/status-dot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetAppointmentQuery, useUpdateAppointmentMutation } from "@/lib/services/appointments";
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState as setMasterDialogsState } from "@/lib/store/dialogs-store";
import { cn, placeholder } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ActivitySquare, CalendarCheck2, CalendarPlus, ChevronDown, Hospital, MapPin, Pencil, Stethoscope, Sticker } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppointmentDetail } from "../schemas/appointments";
import { appointmentStates, modesOfCare } from "../utils";

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
  icon?: React.ReactNode;
};

const fields: FieldDefinition<AppointmentDetail>[] = [
  {
    label: "Fecha de inicio",
    placeholderLength: 14,
    getValue: (p) => p?.start_date ? format(new Date(`${p?.start_date} ${p?.start_time}`), "PP hh:mmaaa", { locale: es }) : "No especificada",
    icon: <CalendarPlus className="mr-1" size={16} />,
  },
  {
    label: "Fecha de fin",
    placeholderLength: 14,
    getValue: (p) => p?.start_date ? format(new Date(`${p.end_date} ${p.end_time}`), "PP hh:mmaaa", { locale: es }) : "No especificada",
    icon: <CalendarCheck2 className="mr-1" size={16} />,
  },
  {
    label: "Profesional",
    placeholderLength: 10,
    getValue: (p) => p?.doctor?.first_name + " " + p?.doctor?.last_name,
    icon: <Stethoscope className="mr-1" size={16} />,
  },
  {
    label: "Tipo de atención",
    placeholderLength: 10,
    getValue: (p) => p?.template?.name,
    icon: <ActivitySquare className="mr-1" size={16} />,
  },
  {
    label: "Sede",
    placeholderLength: 20,
    getValue: (p) => p?.clinic?.name || "No especificada",
    icon: <Hospital className="mr-1" size={16} />,

  },
  {
    label: "Modo de atención",
    placeholderLength: 20,
    getValue: (p) => p?.mode_of_care ? modesOfCare[p.mode_of_care as keyof typeof modesOfCare] : "No especificado",
    icon: <MapPin className="mr-1" size={16} />,
  },
  {
    label: "Notas",
    placeholderLength: 20,
    getValue: (p) => p?.notes || "No hay notas para mostrar",
    className: "col-span-2",
    icon: <Sticker className="mr-1" size={16} />,
  }
];

export default function AppointmentDetailsDialog() {
  const router = useRouter()

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const appointmentId = dialogState?.payload?.appointment_id as string

  const { data: appointment, isLoading: isAppointmentLoading } = useGetAppointmentQuery(appointmentId, {
    skip: !appointmentId
  });
  const [updateAppointment] = useUpdateAppointmentMutation()

  const onOpenChange = () => {
    closeDialogs()
  }

  const handleUpdateAppointment = async ({ status }: { status: "SCHEDULED" | "CANCELLED" }) => {
    try {
      const response = await updateAppointment({
        id: appointment?.id as string,
        body: { status }
      }).unwrap()
      if (response.status === "SUCCESS") {
        toast.custom((t) => <CustomSonner t={t} description="Turno actualizado correctamente" />);
      }
    } catch {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar el turno" variant="error" />);
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
            <DialogTitle className={cn("transition-all duration-300", isAppointmentLoading ? "blur-[4px]" : "blur-none")}>
              {isAppointmentLoading ? placeholder(12) : appointment?.patient?.first_name} {appointment?.patient?.last_name}
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
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isAppointmentLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(appointment!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <div className="flex items-center gap-1">
                  {field.icon && field.icon}
                  <label className="text-muted-foreground text-sm">
                    {field.label}
                  </label>
                </div>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isAppointmentLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
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
              router.push(`/medical-management/visits/new/${appointment?.id}`)
            }}
          >
            Iniciar visita
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}