import { AppointmentList } from "./schemas/appointments";

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