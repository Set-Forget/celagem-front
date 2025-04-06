import { useState, useEffect } from "react";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { format, formatISO, parse } from "date-fns";
import { es } from "date-fns/locale";
import { AppointmentList } from "../schemas/appointments";
import {
  calculateOverlaps,
  getAppointmentColor,
  getTimeSlots,
  groupAppointmentsByDayExtended,
} from "../utils";

function parseTimeToMinutes(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function assignStackIndexes(appointments: AppointmentList[]) {
  const groups: AppointmentList[][] = [];
  const sorted = [...appointments].sort(
    (a, b) =>
      parseTimeToMinutes(a.start_time) - parseTimeToMinutes(b.start_time)
  );

  sorted.forEach(app => {
    const appStart = parseTimeToMinutes(app.start_time);
    let placed = false;
    for (const group of groups) {
      const groupMaxEnd = Math.max(...group.map(a => parseTimeToMinutes(a.end_time)));
      if (appStart < groupMaxEnd) {
        group.push(app);
        placed = true;
        break;
      }
    }
    if (!placed) {
      groups.push([app]);
    }
  });

  const result: (AppointmentList & { stackIndex: number; duration: number })[] = [];
  groups.forEach(group => {
    const groupWithDuration = group.map(app => {
      const start = parseTimeToMinutes(app.start_time);
      const end = parseTimeToMinutes(app.end_time);
      return { ...app, duration: end - start };
    });
    groupWithDuration.sort((a, b) => b.duration - a.duration);
    groupWithDuration.forEach((app, index) => {
      result.push({ ...app, stackIndex: index });
    });
  });

  return result;
}

export default function DayColumn({
  day,
  appointments,
}: {
  day: Date;
  appointments?: AppointmentList[];
}) {
  const timeSlots = getTimeSlots();
  const totalRows = timeSlots.length;
  const [firstHourStr, firstMinuteStr] = timeSlots[0].split(":");
  const gridStartMinutes = Number(firstHourStr) * 60 + Number(firstMinuteStr);
  const totalMinutes = timeSlots.length * 30;
  const isLastDay = day.getDay() === 6;
  const isToday = day.toDateString() === new Date().toDateString();

  let linePositionPercent: number | null = null;
  if (isToday) {
    const minutesFromStart = new Date().getHours() * 60 + new Date().getMinutes() - gridStartMinutes;
    if (minutesFromStart >= 0 && minutesFromStart <= totalMinutes) {
      linePositionPercent = (minutesFromStart / totalMinutes) * 100;
    }
  }

  const dayAppointmentsRaw = calculateOverlaps(
    groupAppointmentsByDayExtended(appointments, day, timeSlots)
  );

  const dayAppointments = assignStackIndexes(dayAppointmentsRaw);

  return (
    <div className={`grid grid-rows-[repeat(${totalRows},1fr)] relative z-0`}>
      {isToday && linePositionPercent !== null && (
        <div
          style={{
            position: "absolute",
            top: `${linePositionPercent}%`,
            left: 0,
            right: 0,
            height: "2px",
            backgroundColor: "red",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "red",
              position: "absolute",
              left: 0,
              transform: "translateX(-50%) translateY(-50%)",
              top: "50%",
            }}
          />
        </div>
      )}

      {dayAppointments.map(appointment => {
        const [startHour, startMinute] = appointment.start_time.split(":").map(Number);
        const appointmentStartMinutes = startHour * 60 + startMinute;
        const startRow = (appointmentStartMinutes - gridStartMinutes) / 30;

        const [endHour, endMinute] = appointment.end_time ? appointment.end_time.split(":").map(Number) : [startHour, startMinute + 30];
        const appointmentEndMinutes = endHour * 60 + endMinute;
        const endRow = (appointmentEndMinutes - gridStartMinutes) / 30;

        const offsetPx = appointment.stackIndex * 14;
        const width = `calc(100% - ${offsetPx}px - 7px)`;
        const left = `${offsetPx + 3}px`;
        const zIndex = appointment.stackIndex + 1;

        const startDateTimeISO = formatISO(parse(`${appointment.start_date} ${appointment.start_time}`, "yyyy-MM-dd HH:mm", new Date()));
        const endDateTimeISO = formatISO(parse(`${appointment.end_date} ${appointment.end_time}`, "yyyy-MM-dd HH:mm", new Date()));
        const appointmentColor = getAppointmentColor(appointment.id).base;
        const isAppointmentInPast = new Date() > new Date(
          `${appointment.start_date}T${appointment.start_time ?? '00:00'}:00`
        );

        return (
          <div
            key={appointment.id}
            className={cn(
              "absolute cursor-pointer px-2 flex flex-col py-1 text-background text-xs h-[calc(100%-4px)] text-left transition-all shadow-md",
              appointmentColor
            )}
            style={{
              gridRowStart: Math.floor(startRow) + 1,
              gridRowEnd: Math.floor(endRow) + 1,
              width,
              left,
              zIndex,
            }}
            onClick={() => {
              setDialogsState({
                open: "appointment-details",
                payload: { appointment_id: appointment.id },
              });
            }}
          >
            <p className={cn("font-medium ml-0.5 truncate", (isAppointmentInPast || appointment.status === "CANCELLED") && "line-through")}>
              {appointment.patient.first_name} {appointment.patient.last_name}
            </p>
            <p className={cn("ml-0.5 truncate text-[11px] opacity-75", (isAppointmentInPast || appointment.status === "CANCELLED") && "line-through")}>
              {format(new Date(startDateTimeISO), new Date(startDateTimeISO).getMinutes() === 0 ? "haaa" : "h:mmaaa")} a{" "}
              {format(new Date(endDateTimeISO), new Date(endDateTimeISO).getMinutes() === 0 ? "haaa" : "h:mmaaa")}
            </p>
          </div>
        );
      })}

      {timeSlots.map((slot, slotIndex) => (
        <button
          key={slotIndex}
          className={cn(
            "h-10 border-b text-center text-sm hover:bg-accent transition cursor-pointer last:border-b-0 border-r",
            isLastDay && "border-r-0",
            day.toDateString() === new Date().toDateString() && "bg-accent/50"
          )}
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
