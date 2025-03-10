import { AppointmentList } from '../schemas/appointments';
import DayColumn from './day-column';
import TimeSlots from './time-slots';

export default function DailyView({ selectedDate, appointments }: { selectedDate: Date; appointments?: AppointmentList[]; }) {
  const formattedDate = selectedDate.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <div className="grid grid-cols-[150px_1fr] border-b sticky top-[65px] bg-background z-[6]">
        <div className="grid grid-rows-1 border-r"></div>
        <div className="p-2 text-center text-xs font-semibold">
          {formattedDate}
        </div>
      </div>

      <div className="grid grid-cols-[150px_1fr]">
        <TimeSlots />
        <DayColumn
          day={selectedDate}
          appointments={appointments}
        />
      </div>
    </>
  );
}
