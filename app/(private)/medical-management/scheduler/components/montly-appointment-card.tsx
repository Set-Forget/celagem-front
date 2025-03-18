import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { appointmentStates } from "../utils";
import { AppointmentList } from "../schemas/appointments";

export default function MonthlyAppointmentCard({
  appointment,
  isCurrentMonth,
}: {
  appointment: AppointmentList,
  isCurrentMonth: boolean,
}) {
  return (
    <div
      className={cn("appointment text-xs px-1.5 py-0.5 w-full truncate flex items-center gap-1 cursor-pointer hover:bg-accent transition-colors")}
      onMouseOver={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        setDialogsState({
          open: 'appointment-details',
          payload: {
            appointment_id: appointment.id,
          },
        });
      }}
    >
      <div
        className={cn(
          "w-2 h-2 border border-primary bg-primary/15 rounded-full mr-1 shrink-0 !shadow-sm",
          appointmentStates[appointment?.status as keyof typeof appointmentStates]?.bg_color,
          appointmentStates[appointment?.status as keyof typeof appointmentStates]?.border_color,
          appointmentStates[appointment?.status as keyof typeof appointmentStates]?.shadow_color,
          !isCurrentMonth && "border-border bg-accent/25 shadow-border"
        )}
      />
      <span>{format(parse(appointment?.start_time ?? "", 'HH:mm', new Date()), "hh:mm a")}</span>
      <p className="font-semibold ml-0.5 truncate">
        {appointment?.patient?.first_name} {appointment?.patient?.last_name}
      </p>
    </div>
  )
}