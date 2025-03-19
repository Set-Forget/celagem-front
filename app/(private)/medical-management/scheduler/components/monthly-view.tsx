'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { AppointmentList } from '../schemas/appointments';
import MonthlyAppointmentCard from './montly-appointment-card';

function getCalendarDates(selectedDate: Date): Date[] {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayIndex = firstDayOfMonth.getDay();
  const daysToShowBefore = firstDayIndex;
  const totalCells = 42;
  const dates: Date[] = [];
  const startDate = new Date(year, month, 1 - daysToShowBefore);

  for (let i = 0; i < totalCells; i++) {
    const current = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + i
    );
    dates.push(current);
  }

  return dates;
}

export default function MonthlyView({
  selectedDate,
  appointments,
}: {
  selectedDate: Date;
  appointments?: AppointmentList[];
}) {

  function getAppointmentsForDay(cellDate: Date) {
    if (!appointments) return [];

    const dayStart = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(), 0, 0, 0);
    const dayEnd = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(), 23, 59, 59);

    return appointments
      .filter((appointment) => {
        const apptStart = new Date(`${appointment.start_date}T${appointment.start_time ?? '00:00'}:00`);
        const apptEnd = new Date(`${appointment.end_date}T${appointment.end_time ?? '23:59'}:00`);

        if (apptStart <= dayEnd && apptEnd >= dayStart) {
          return true;
        }
        return false;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
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
                'relative h-full border border-l-0 min-h-[130px] text-center text-sm pt-2 transition flex flex-col items-center hover:cursor-pointer hover:bg-accent [&:has(.appointment:hover)]:hover:bg-transparent',
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
              <div className="flex flex-col items-start w-full overflow-hidden absolute top-8 mt-2">
                {dayAppointments.slice(0, 3).map((appointment) => (
                  <MonthlyAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isCurrentMonth={isCurrentMonth}
                  />
                ))}
                {dayAppointments.length > 3 && (
                  <Popover>
                    <PopoverTrigger
                      onClick={(e) => e.stopPropagation()}
                      asChild
                    >
                      <span
                        className="appointment font-medium text-xs px-1.5 py-0.5 w-full truncate flex items-center gap-1 cursor-pointer hover:bg-accent transition-colors mt-auto"
                      >
                        ... {dayAppointments.length - 3} más
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-[280px] p-2 shadow-none" side="top">
                      {dayAppointments.slice(3).map((appointment) => (
                        <div
                          key={appointment.id}
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
                              "w-2 h-2 border border-primary bg-primary/15 rounded-full mr-1 shrink-0 !shadow-sm !shadow-primary/50",
                              !isCurrentMonth && "border-border bg-accent/25 shadow-border"
                            )}
                          />
                          <span>
                            {format(parse(appointment?.start_time ?? "", 'HH:mm', new Date()), "hh:mm a")}
                          </span>
                          <p className="font-semibold ml-0.5 truncate">
                            {appointment?.patient?.first_name} {appointment?.patient?.last_name}
                          </p>
                        </div>
                      ))}
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
