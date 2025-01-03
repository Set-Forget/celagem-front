'use client';

import { setDialogsState } from '@/lib/store/dialogs-store';
import { cn } from '@/lib/utils';
import React from 'react';

export default function MonthlyView({ selectedDate, appointments }: { selectedDate: Date, appointments: any[] }) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(prevMonthLastDay - i);
    }

    for (let day = 1; day <= lastDay; day++) {
      days.push(day);
    }

    const totalDays = days.length;
    for (let i = 1; totalDays + i <= 35; i++) {
      days.push(i);
    }

    return days;
  };

  const days = getDaysInMonth(selectedDate);

  const getAppointmentsForDay = (day: number) => {
    const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return appointments
      .filter((appointment) => {
        return appointment.start_date === formattedDate;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  return (
    <>
      <div className='grid grid-cols-7'>
        {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((d) => (
          <div key={d} className='p-2 text-center text-xs font-semibold border-r last:border-r-0'>
            {d}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7 h-full'>
        {days.map((day, index) => {
          const appointments = getAppointmentsForDay(day);
          return (
            <button
              key={index}
              className={cn(
                'h-full border border-l-0 border-b-0 text-center text-sm pt-2 transition hover:bg-accent hover:cursor-pointer flex flex-col items-center relative [&:has(.appointment:hover)]:bg-transparent',
                index % 7 === 6 && 'border-r-0',
                new Date().getDate() === day && new Date().getMonth() === selectedDate.getMonth() && new Date().getFullYear() === selectedDate.getFullYear() && 'bg-accent/50'
              )}
              onClick={() => {
                setDialogsState({
                  open: "new-appointment",
                  payload: {
                    date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day),
                  }
                });
              }}
            >
              <div>
                {day === 1 && index < 7 && selectedDate.toLocaleString('es-AR', { month: 'short' }).charAt(0).toUpperCase() + selectedDate.toLocaleString('es-AR', { month: 'short' }).slice(1)}
                {day === 1 && index >= 7 && new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1).toLocaleString('es-AR', { month: 'short' }).charAt(0).toUpperCase() + new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1).toLocaleString('es-AR', { month: 'short' }).slice(1)}
                {" "}
                {day}
              </div>

              {/* Render Appointments */}
              <div className="flex flex-col items-start mt-1 gap-1 w-full overflow-hidden max-h-16 absolute top-8">
                {appointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="appointment text-xs px-1.5 py-0.5 w-full truncate flex items-center gap-1 cursor-pointer hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDialogsState({
                        open: 'appointment-details',
                        payload: appointments.find((a) => a.id === appointment.id),
                      });
                    }}
                  >
                    <div className="w-2 h-2 border border-primary bg-primary/15 rounded-full mr-1 shrink-0"></div>
                    <span>
                      {appointment.start_time}
                    </span>
                    <span className="font-semibold">
                      User {appointment.created_by_user_id}
                    </span>
                  </div>
                ))}

                {appointments.length > 3 && (
                  <div className="text-xs text-gray-500 mt-1">
                    ...{appointments.length - 3} más
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
