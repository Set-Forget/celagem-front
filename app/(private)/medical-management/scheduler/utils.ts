import { isSameDay, parseISO, startOfDay } from "date-fns";
import { AppointmentList } from "./schemas/appointments";

export const modesOfCare = {
  VIRTUAL: 'Virtual',
  IN_PERSON: 'Presencial',
}

export const appointmentStates = {
  "COMPLETED": {
    label: "Completado",
    bg_color: "bg-green-100",
    text_color: "text-green-800",
    border_color: "border-green-500",
    shadow_color: "!shadow-green-500/50",
  },
  "CANCELLED": {
    label: "Cancelado",
    bg_color: "bg-red-100",
    text_color: "text-red-800",
    border_color: "border-red-500",
    shadow_color: "!shadow-red-500/50",
  },
  "SCHEDULED": {
    label: "Pendiente",
    bg_color: "bg-indigo-100",
    text_color: "text-indigo-800",
    border_color: "border-indigo-500",
    shadow_color: "!shadow-indigo-500/50",
  },
}

export const getDaysInWeek = (date: Date) => {
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

export const getTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      slots.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      );
    }
  }
  slots.push("18:00");
  return slots;
};

export const calculateOverlaps = (appointments: AppointmentList[] | undefined) => {
  if (!appointments) return [];

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

export const groupAppointmentsByDay = (appointments: AppointmentList[] | undefined, day: Date) => {
  const formattedDate = `${day.getFullYear()}-${(day.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}`;

  return appointments
    ?.filter((appointment) => appointment.start_date === formattedDate)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
};

export const getRangeForView = (view: string, date: Date) => {
  if (view === 'month' || view === 'table') {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  }
  if (view === 'week') {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  }
  return { start: date, end: date };
};

export const groupAppointmentsByDayExtended = (
  appointments: AppointmentList[] = [],
  day: Date,
  timeSlots: string[]
): AppointmentList[] => {
  return appointments
    .filter((appointment) => {
      const startDate = parseISO(appointment.start_date);
      const endDate = parseISO(appointment.end_date);
      return day >= startOfDay(startDate) && day <= startOfDay(endDate);
    })
    .map((appointment) => {
      const startDate = parseISO(appointment.start_date);
      const endDate = parseISO(appointment.end_date);

      let effectiveStartTime = appointment.start_time;
      let effectiveEndTime = appointment.end_time;

      const firstSlot = timeSlots[0];
      const lastSlot = timeSlots[timeSlots.length - 1];

      if (isSameDay(day, startDate) && isSameDay(day, endDate)) {
      } else if (isSameDay(day, startDate)) {
        effectiveEndTime = lastSlot;
      } else if (isSameDay(day, endDate)) {
        effectiveStartTime = firstSlot;
      } else {
        effectiveStartTime = firstSlot;
        effectiveEndTime = lastSlot;
      }

      return {
        ...appointment,
        start_time: effectiveStartTime,
        end_time: effectiveEndTime,
      };
    });
}