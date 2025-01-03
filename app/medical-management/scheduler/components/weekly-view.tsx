'use client';

import { setDialogsState } from '@/lib/store/dialogs-store';
import { cn } from '@/lib/utils';

export default function WeeklyView({ selectedDate, appointments }: { selectedDate: Date; appointments: any[] }) {
  const getDaysInWeek = (date: Date) => {
    const startOfWeek = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay()
    );
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const groupAppointmentsByDay = (appointments: any[], day: Date) => {
    const formattedDate = `${day.getFullYear()}-${(day.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}`;

    return appointments
      .filter((appointment) => appointment.start_date === formattedDate)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
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

  const days = getDaysInWeek(selectedDate);
  const timeSlots = getTimeSlots();

  return (
    <>
      <div className="grid grid-cols-8 h-full border-b sticky top-[65px] bg-background z-[6]">
        <div className="grid grid-rows-1 border-r"></div>
        {days.map((day, index) => (
          <div
            key={index}
            className="p-2 text-center text-xs font-semibold border-r last:border-r-0"
          >
            {day.toLocaleDateString('es-AR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8 h-full">
        <div className="grid grid-rows-[repeat(48,1fr)] border-r">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              id={index.toString()}
              className={cn(
                'text-center text-xs py-1 border-b h-8 last:border-b-0 relative'
              )}
            >
              <span className={cn('absolute top-[-1px] border rounded-sm left-1/2 bg-background w-[60px] transform -translate-x-1/2 -translate-y-1/2', index === 0 && ' z-[7]')}>
                {slot}
              </span>
            </div>
          ))}
        </div>

        {days.map((day, dayIndex) => {
          const dayAppointments = calculateOverlaps(
            groupAppointmentsByDay(appointments, day)
          );

          return (
            <div
              key={dayIndex}
              className="grid grid-rows-[repeat(48,1fr)] border-r last:border-r-0 relative z-0"
            >
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
                    'h-full border-b text-center text-sm hover:bg-accent transition cursor-pointer last:border-b-0',
                    day.toDateString() === new Date().toDateString() &&
                    'bg-accent/50'
                  )}
                  onClick={() => {
                    const [hour, minute] = slot.split(':').map(Number);
                    setDialogsState({
                      open: 'new-appointment',
                      payload: {
                        date: new Date(
                          day.getFullYear(),
                          day.getMonth(),
                          day.getDate(),
                          hour,
                          minute
                        ),
                      },
                    });
                  }}
                ></button>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}