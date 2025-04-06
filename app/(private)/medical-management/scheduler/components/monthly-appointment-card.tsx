import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { AppointmentList } from "../schemas/appointments";
import { getAppointmentColor } from "../utils";

type Variant = 'start' | 'middle' | 'end' | 'single';

export default function MonthlyAppointmentCard({
  appointment,
  variant,
}: {
  appointment: AppointmentList,
  variant: Variant,
}) {
  const startTime = parse(appointment.start_time, 'HH:mm', new Date());
  const appointmentColor = getAppointmentColor(appointment.id).base;
  const isAppointmentInPast = new Date() > new Date(
    `${appointment.start_date}T${appointment.start_time ?? '00:00'}:00`
  );

  const borderRadiusClass = variant === 'start'
    ? 'rounded-tl-md rounded-bl-md'
    : variant === 'end'
      ? 'rounded-tr-md rounded-br-md'
      : variant === 'middle'
        ? 'rounded-none'
        : 'rounded-md';

  return (
    <div
      className={cn(
        "appointment text-xs px-1.5 py-0.5 w-full truncate flex items-center gap-1 cursor-pointer transition-colors !shadow-md h-5",
        appointmentColor,
        borderRadiusClass
      )}
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
      {variant !== 'middle' && variant !== 'end' && (
        <>
          <span className={cn("text-[11px] opacity-75", (isAppointmentInPast || appointment.status === "CANCELLED") && "line-through")}>
            {format(startTime, startTime.getMinutes() === 0 ? "haaa" : "h:mmaaa")}
          </span>
          <p className={cn("font-medium ml-0.5 truncate", (isAppointmentInPast || appointment.status === "CANCELLED") && "line-through")}>
            {appointment?.patient?.first_name} {appointment?.patient?.last_name}
          </p>
        </>
      )}
    </div>
  );
}
