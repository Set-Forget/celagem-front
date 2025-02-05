import { cn } from "@/lib/utils";
import { getTimeSlots } from "../utils";

export default function WeeklyViewTimes() {
  const timeSlots = getTimeSlots();

  return (
    <div className="grid grid-rows-[repeat(48,1fr)] border-r">
      {timeSlots.map((slot, index) => (
        <div
          key={index}
          id={index.toString()}
          className={cn(
            'text-center text-xs py-1 border-b h-8 last:border-b-0 relative'
          )}
        >
          <span className={cn('absolute top-[-1px] border rounded-sm left-1/2 bg-background w-[60px] transform -translate-x-1/2 -translate-y-1/2', index === 0 && ' z-[7]')}>
            {slot}
          </span>
        </div>
      ))}
    </div>
  )
}