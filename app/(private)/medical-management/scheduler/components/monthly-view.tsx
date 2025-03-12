'use client';

import { setDialogsState } from '@/lib/store/dialogs-store';
import { cn } from '@/lib/utils';
import { AppointmentList } from '../schemas/appointments';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { appointmentStates } from '../utils';
import { format, parse } from 'date-fns';

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
    dates.push(current)
  }

  return dates;
}

export default function MonthlyView({ selectedDate, appointments }: { selectedDate: Date, appointments?: AppointmentList[] }) {
  const getAppointmentsForDay = (cellDate: Date) => {
    const formattedDate = cellDate.toISOString().slice(0, 10);
    return appointments
      ?.filter((appointment) => {
        return appointment.start_date === formattedDate;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const calendarDates = getCalendarDates(selectedDate);

  return (
    <>
      <div className='grid grid-cols-7'>
        {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((d) => (
          <div
            key={d}
            className='p-2 text-center text-xs font-semibold border-r last:border-r-0'
          >
            {d}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7 h-full'>
        {calendarDates.map((cellDate, index) => {
          const dayNum = cellDate.getDate();
          const cellMonth = cellDate.getMonth();
          const cellYear = cellDate.getFullYear();
          const isToday = new Date().toDateString() === cellDate.toDateString();
          const isCurrentMonth = cellMonth === selectedDate.getMonth() && cellYear === selectedDate.getFullYear();
          const dayAppointments = getAppointmentsForDay(cellDate);

          return (
            <button
              key={index}
              className={cn(
                'relative h-full border border-l-0 min-h-[130px] border-b-0 text-center text-sm pt-2 transition flex flex-col items-center hover:cursor-pointer hover:bg-accent [&:has(.appointment:hover)]:hover:bg-transparent',
                index % 7 === 6 && 'border-r-0',
                !isCurrentMonth && 'text-gray-400 bg-accent/50'
              )}
              onClick={(e) => {
                e.stopPropagation();
                setDialogsState({
                  open: "new-appointment",
                  payload: { date: cellDate },
                });
              }}
            >
              <div
                className={cn(
                  isToday && 'bg-primary text-white w-6 h-6 rounded-sm flex items-center justify-center',
                  isToday && !isCurrentMonth && 'bg-accent text-foreground border',
                )}
              >
                {dayNum}
              </div>

              <div className="flex flex-col items-start w-full overflow-hidden absolute top-8 mt-2">
                {dayAppointments?.slice(0, 3).map((appointment) => (
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
                ))}
                {dayAppointments && dayAppointments.length > 3 && (
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
                          <span>{format(parse(appointment?.start_time ?? "", 'HH:mm', new Date()), "hh:mm a")}</span>
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