import { AppointmentList } from '../schemas/appointments';
import { getDaysInWeek } from '../utils';
import DayColumn from './day-column';
import TimeSlots from './time-slots';
import WeeklyViewHeader from './weekly-view-header';

export default function WeeklyView({ selectedDate, appointments }: { selectedDate: Date; appointments?: AppointmentList[]; }) {
  const days = getDaysInWeek(selectedDate);
  return (
    <>
      <WeeklyViewHeader selectedDate={selectedDate} />
      <div className="grid grid-cols-8">
        <TimeSlots />
        {days.map((day, index) => (
          <DayColumn
            key={index}
            day={day}
            appointments={appointments}
          />
        ))}
      </div>
    </>
  );
}