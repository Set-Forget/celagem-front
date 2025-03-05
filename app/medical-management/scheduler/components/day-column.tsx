import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { format, formatISO, parse } from "date-fns";
import { es } from "date-fns/locale";
import { AppointmentList } from "../schemas/appointments";
import { calculateOverlaps, getTimeSlots, groupAppointmentsByDayExtended } from "../utils";

export default function DayColumn({
  day,
  appointments,
}: {
  day: Date;
  appointments?: AppointmentList[];
}) {
  const timeSlots = getTimeSlots();

  const dayAppointments = calculateOverlaps(groupAppointmentsByDayExtended(appointments, day, timeSlots));

  const [firstHourStr, firstMinuteStr] = timeSlots[0].split(":");
  const gridStartMinutes = Number(firstHourStr) * 60 + Number(firstMinuteStr);
  const totalRows = timeSlots.length;
  const isLastDay = day.getDay() === 6;

  return (
    <div className={`grid grid-rows-[repeat(${totalRows},1fr)] relative z-0`}>
      {dayAppointments.map((appointment) => {
        const [startHour, startMinute] = appointment.start_time
          .split(":")
          .map(Number);
        const appointmentStartMinutes = startHour * 60 + startMinute;
        const startRow = (appointmentStartMinutes - gridStartMinutes) / 30;

        const [endHour, endMinute] = appointment.end_time
          ? appointment.end_time.split(":").map(Number)
          : [startHour, startMinute + 30];
        const appointmentEndMinutes = endHour * 60 + endMinute;
        const endRow = (appointmentEndMinutes - gridStartMinutes) / 30;

        const width = `calc((100% - ${(appointment.level - 1) * 2}px) / ${appointment.level} - 1px)`;
        const left = `calc(${appointment.position} * ((100% - ${(appointment.level - 1) * 2}px) / ${appointment.level}) + ${appointment.position * 2}px)`;

        const startDateTimeISO = formatISO(
          parse(
            `${appointment.start_date} ${appointment.start_time}`,
            "yyyy-MM-dd HH:mm",
            new Date()
          )
        );
        const endDateTimeISO = formatISO(
          parse(
            `${appointment.end_date} ${appointment.end_time}`,
            "yyyy-MM-dd HH:mm",
            new Date()
          )
        );

        return (
          <div
            key={appointment.id}
            className={cn(
              "absolute cursor-pointer px-2 flex flex-col py-1 bg-primary text-background text-xs h-[calc(100%-4px)] text-left hover:bg-primary/90 transition !shadow-lg !shadow-primary/25",
              new Date() > new Date(endDateTimeISO) && "opacity-50",
              appointment.status === "CANCELLED" && "bg-red-500 hover:bg-red-500/90 !shadow-red-500/25",
              appointment.status === "COMPLETED" && "bg-emerald-500 hover:bg-emerald-500/90 !shadow-emerald-500/25",
            )}
            style={{
              gridRowStart: Math.floor(startRow) + 1,
              gridRowEnd: Math.floor(endRow) + 1,
              width,
              left,
            }}
            onClick={() => {
              setDialogsState({
                open: "appointment-details",
                payload: {
                  appointment: appointments?.find((a) => a.id === appointment.id),
                },
              });
            }}
          >
            <p className="font-medium truncate">
              {appointment.patient.first_name} {appointment.patient.last_name}
            </p>
            <p className="text-xs truncate">
              {format(new Date(startDateTimeISO), "hh:mm", { locale: es })} a{" "}
              {format(new Date(endDateTimeISO), "hh:mm a", { locale: es })}
            </p>
          </div>
        );
      })}

      {timeSlots.map((slot, slotIndex) => (
        <button
          key={slotIndex}
          className={`h-10 border-b text-center text-sm hover:bg-accent transition cursor-pointer last:border-b-0 last:invisible border-r ${isLastDay ? "border-r-0" : ""} ${day.toDateString() === new Date().toDateString() ? "bg-accent/50" : ""}`}
          onClick={() => {
            const [hour, minute] = slot.split(":").map(Number);
            setDialogsState({
              open: "new-appointment",
              payload: {
                date: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute),
              },
            });
          }}
        />
      ))}
    </div>
  );
}
