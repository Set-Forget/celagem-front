import { AppointmentList } from '../schemas/appointments';
import { getDaysInWeek } from '../utils';
import DayColumn from './day-column';
import WeeklyViewHeader from './weekly-view-header';
import WeeklyViewTimes from './weekly-view-times';

export default function WeeklyView({ selectedDate, appointments }: { selectedDate: Date; appointments?: AppointmentList[]; }) {
  const days = getDaysInWeek(selectedDate);
  return (
    <>
      <WeeklyViewHeader selectedDate={selectedDate} />
      <div className="grid grid-cols-8 h-full">
        <WeeklyViewTimes />
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