import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { AppointmentList } from "../schemas/appointments";
import { calculateOverlaps, getTimeSlots, groupAppointmentsByDay } from "../utils";

export default function DayColumn({ day, appointments }: { day: Date; appointments?: AppointmentList[]; }) {
  const dayAppointments = calculateOverlaps(groupAppointmentsByDay(appointments, day));
  const timeSlots = getTimeSlots();

  return (
    <div className="grid grid-rows-[repeat(48,1fr)] border-r last:border-r-0 relative z-0">
      {dayAppointments.map(appointment => {
        const [startHour, startMinute] = appointment.start_time.split(':').map(Number);
        const startRow = startHour * 2 + startMinute / 30;

        const [endHour, endMinute] = appointment.end_time
          ? appointment.end_time.split(':').map(Number)
          : [startHour, startMinute + 30];
        const endRow = endHour * 2 + endMinute / 30;

        const width = `calc((100% - ${(appointment.level - 1) * 2}px) / ${appointment.level})`;
        const left = `calc(${appointment.position} * ((100% - ${(appointment.level - 1) * 2}px) / ${appointment.level}) + ${appointment.position * 2}px)`;

        return (
          <button
            key={appointment.id}
            className={cn(
              "absolute px-2 py-1 bg-primary text-background text-xs h-full text-left hover:bg-primary/90 transition"
            )}
            style={{
              gridRowStart: Math.floor(startRow) + 1,
              gridRowEnd: Math.floor(endRow) + 1,
              width,
              left,
            }}
            onClick={() => {
              setDialogsState({
                open: 'appointment-details',
                payload: appointments?.find(a => a.id === appointment.id),
              });
            }}
          >
            {`${appointment.start_time} - User ${appointment.created_by}`}
          </button>
        );
      })}

      {timeSlots.map((slot, slotIndex) => (
        <button
          key={slotIndex}
          className={cn(
            'h-full border-b text-center text-sm hover:bg-accent transition cursor-pointer last:border-b-0',
            day.toDateString() === new Date().toDateString() && 'bg-accent/50'
          )}
          onClick={() => {
            const [hour, minute] = slot.split(':').map(Number);
            setDialogsState({
              open: 'new-appointment',
              payload: {
                date: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute),
              },
            });
          }}
        />
      ))}
    </div>
  )
}