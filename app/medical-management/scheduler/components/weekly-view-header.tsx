import { getDaysInWeek } from "../utils";


export default function WeeklyViewHeader({ selectedDate }: { selectedDate: Date; }) {
  const days = getDaysInWeek(selectedDate);

  return (
    <div className="grid grid-cols-8 h-full border-b sticky top-[65px] bg-background z-[6]">
      <div className="grid grid-rows-1 border-r"></div>
      {days.map((day, index) => (
        <div
          key={index}
          className="p-2 text-center text-xs font-semibold border-r last:border-r-0"
        >
          {day.toLocaleDateString('es-AR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        </div>
      ))}
    </div>
  )
}