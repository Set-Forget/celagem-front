'use client';

import { setDialogsState } from '@/lib/store/dialogs-store';
import { cn } from '@/lib/utils';

export default function DailyView({ selectedDate, appointments }: { selectedDate: Date; appointments: any[] }) {
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(
          `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`
        );
      }
    }
    return slots;
  };

  const calculateOverlaps = (appointments: any[]) => {
    const positions = Array(appointments.length).fill(0);
    const levels = Array(appointments.length).fill(0);

    for (let i = 0; i < appointments.length; i++) {
      const { start_time: startA, end_time: endA } = appointments[i];
      for (let j = 0; j < i; j++) {
        const { start_time: startB, end_time: endB } = appointments[j];

        if (
          (startA < endB && startA >= startB) ||
          (startB < endA && startB >= startA)
        ) {
          positions[i] = Math.max(positions[i], positions[j] + 1);
        }
      }
      levels[i] = positions[i];
    }

    const maxOverlap = Math.max(...levels) + 1;
    return appointments.map((appointment, index) => ({
      ...appointment,
      position: positions[index],
      level: maxOverlap,
    }));
  };

  const groupAppointmentsByDay = (appointments: any[], day: Date) => {
    const formattedDate = `${day.getFullYear()}-${(day.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}`;

    return appointments
      .filter((appointment) => appointment.start_date === formattedDate)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const timeSlots = getTimeSlots();
  const formattedDate = selectedDate.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const dayAppointments = calculateOverlaps(
    groupAppointmentsByDay(appointments, selectedDate)
  );

  return (
    <>
      {/* Header */}
      <div className="grid grid-cols-[150px_1fr] border-b sticky top-[65px] bg-background z-[6]">
        <div className="grid grid-rows-1 border-r"></div>
        <div className="p-2 text-center text-xs font-semibold">
          {formattedDate}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[150px_1fr] h-full">
        {/* Time Slots Column */}
        <div className="grid grid-rows-[repeat(48,1fr)] border-r">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className="text-center text-xs py-1 border-b h-8 last:border-b-0 relative"
            >
              <span className={cn('absolute top-[-1px] border rounded-sm left-1/2 bg-background w-[60px] transform -translate-x-1/2 -translate-y-1/2', index === 0 && ' z-[7]')}>
                {slot}
              </span>
            </div>
          ))}
        </div>

        {/* Daily Column */}
        <div className="grid grid-rows-[repeat(48,1fr)] relative">
          {dayAppointments.map((appointment) => {
            const [startHour, startMinute] = appointment.start_time
              .split(':')
              .map(Number);
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
                className={cn("absolute px-2 py-1 bg-primary text-background text-xs h-full text-left hover:bg-primary/90 transition")}
                style={{
                  gridRowStart: Math.floor(startRow) + 1,
                  gridRowEnd: Math.floor(endRow) + 1,
                  width,
                  left,
                }}
                onClick={() => {
                  setDialogsState({
                    open: 'appointment-details',
                    payload: appointments.find((a) => a.id === appointment.id),
                  });
                }}
              >
                {`${appointment.start_time} - User ${appointment.created_by_user_id}`}
              </button>
            );
          })}

          {timeSlots.map((slot, slotIndex) => (
            <button
              key={slotIndex}
              className={cn(
                'h-full border-b text-center text-sm hover:bg-accent transition cursor-pointer last:border-b-0'
              )}
              onClick={() => {
                const [hour, minute] = slot.split(':').map(Number);
                setDialogsState({
                  open: 'new-appointment',
                  payload: {
                    date: new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                      hour,
                      minute
                    ),
                  },
                });
              }}
            ></button>
          ))}
        </div>
      </div>
    </>
  );
}
