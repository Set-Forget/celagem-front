import { cn } from "@/lib/utils";
import { getDaysInWeek } from "../utils";

export default function WeeklyViewHeader({ selectedDate }: { selectedDate: Date; }) {
  const days = getDaysInWeek(selectedDate);

  const isToday = new Date().toDateString() === selectedDate.toDateString();

  return (
    <div className="grid grid-cols-8 border-b sticky top-[49px] bg-background z-[6]">
      <div className="grid grid-rows-1 border-r"></div>
      {days.map((day, index) => (
        <div
          key={index}
          className={cn("p-2 text-center text-xs font-semibold border-r last:border-r-0")}
        >
          <span className={cn(isToday && new Date().toDateString() === day.toDateString() && "bg-primary text-accent px-2 py-1 rounded-sm")}>
            {day.toLocaleDateString('es-AR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      ))}
    </div>
  )
}