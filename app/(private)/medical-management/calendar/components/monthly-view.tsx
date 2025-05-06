'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { cn } from '@/lib/utils';
import { differenceInCalendarDays, format, parse } from 'date-fns';
import { AppointmentList } from '../schemas/appointments';
import MonthlyAppointmentCard from './monthly-appointment-card';
import { getCalendarDates } from '../utils';
import { es } from 'date-fns/locale';

export default function MonthlyView({
  selectedDate,
  appointments,
}: {
  selectedDate: Date;
  appointments?: AppointmentList[];
}) {

  function getAppointmentsForDay(cellDate: Date) {
    if (!appointments) return [];

    const dayStart = new Date(
      cellDate.getFullYear(),
      cellDate.getMonth(),
      cellDate.getDate(),
      0,
      0,
      0
    );
    const dayEnd = new Date(
      cellDate.getFullYear(),
      cellDate.getMonth(),
      cellDate.getDate(),
      23,
      59,
      59
    );

    return appointments
      .filter((appointment) => {
        const apptStart = new Date(
          `${appointment.start_date}T${appointment.start_time ?? '00:00'}:00`
        );
        const apptEnd = new Date(
          `${appointment.end_date}T${appointment.end_time ?? '23:59'}:00`
        );

        return apptStart <= dayEnd && apptEnd >= dayStart;
      })
      .sort((a, b) => {
        const aMulti = a.start_date !== a.end_date;
        const bMulti = b.start_date !== b.end_date;

        if (aMulti && !bMulti) return -1;
        if (!aMulti && bMulti) return 1;

        if (aMulti && bMulti) {
          const durationA = differenceInCalendarDays(new Date(a.end_date), new Date(a.start_date));
          const durationB = differenceInCalendarDays(new Date(b.end_date), new Date(b.start_date));
          if (durationA !== durationB) return durationB - durationA;
        }

        return a.start_time.localeCompare(b.start_time);
      });
  }

  const calendarDates = getCalendarDates(selectedDate);

  return (
    <>
      <div className="grid grid-cols-7">
        {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((d) => (
          <div
            key={d}
            className="p-2 text-center text-xs font-semibold border-r last:border-r-0"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-full">
        {calendarDates.map((cellDate, index) => {
          const dayNum = cellDate.getDate();
          const cellMonth = cellDate.getMonth();
          const cellYear = cellDate.getFullYear();
          const isCurrentMonth = cellMonth === selectedDate.getMonth() && cellYear === selectedDate.getFullYear();
          const isToday = new Date().toDateString() === cellDate.toDateString();
          const dayAppointments = getAppointmentsForDay(cellDate);

          return (
            <button
              key={index}
              className={cn(
                'relative h-full border border-l-0 min-h-[137px] text-center text-sm pt-2 transition flex flex-col items-center hover:cursor-pointer hover:bg-accent [&:has(.appointment:hover)]:hover:bg-transparent',
                'border-b-0',
                index % 7 === 6 && 'border-r-0',
                !isCurrentMonth && 'text-gray-400 bg-accent/50'
              )}
              onClick={(e) => {
                e.stopPropagation();
                setDialogsState({
                  open: 'new-appointment',
                  payload: { date: cellDate },
                });
              }}
            >
              <div
                className={cn(
                  isToday && 'bg-primary text-white w-6 h-6 rounded-sm flex items-center justify-center',
                  isToday && !isCurrentMonth && 'bg-accent text-foreground border'
                )}
              >
                {dayNum}
              </div>
              <div className="flex flex-col items-start w-full absolute top-8 mt-2 px-1 gap-1">
                {dayAppointments.slice(0, 3).map((appointment) => {
                  const currentDateStr = format(cellDate, "yyyy-MM-dd");
                  const variant: 'start' | 'middle' | 'end' | 'single' =
                    appointment.start_date === appointment.end_date ? 'single' :
                      currentDateStr === appointment.start_date ? 'start' :
                        currentDateStr === appointment.end_date ? 'end' : 'middle';

                  return (
                    <MonthlyAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      variant={variant}
                    />
                  );
                })}
                {dayAppointments.length > 3 && (
                  <Popover>
                    <PopoverTrigger
                      onClick={(e) => e.stopPropagation()}
                      asChild
                    >
                      <span
                        className="appointment text-muted-foreground rounded-sm text-xs px-1.5 py-0.5 w-full truncate flex items-center gap-1 cursor-pointer hover:bg-accent transition-colors mt-auto"
                      >
                        + {dayAppointments.length - 3} más
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-[200px] p-2 shadow-none gap-2 flex flex-col" side="top">
                      <span className={cn("font-medium text-xs")}>
                        {format(new Date(), "EEE dd", { locale: es })}
                      </span>
                      {dayAppointments.map((appointment) => {
                        const currentDateStr = format(cellDate, "yyyy-MM-dd");
                        const variant: 'start' | 'middle' | 'end' | 'single' = appointment.start_date === appointment.end_date ? 'single' : currentDateStr === appointment.start_date ? 'start' : currentDateStr === appointment.end_date ? 'end' : 'middle';

                        return (
                          <MonthlyAppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            variant={variant}
                          />
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
