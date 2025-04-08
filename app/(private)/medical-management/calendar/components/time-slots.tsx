import { cn } from "@/lib/utils";
import { getTimeSlots } from "../utils";

export default function TimeSlots() {
  const timeSlots = getTimeSlots();
  const totalRows = timeSlots.length;

  return (
    <div
      className={cn(`grid grid-rows-[repeat(${totalRows},1fr)]`)}
    >
      {timeSlots.map((slot, index) => (
        <div
          key={index}
          id={index.toString()}
          className={cn(
            "text-center text-xs py-1 border-b relative last:border-b-0 h-10 border-r",
          )}
        >
          <span
            className={cn(
              "absolute top-[-1px] border rounded-sm left-1/2 bg-background w-[60px] transform -translate-x-1/2 -translate-y-1/2 ",
              index === 0 && "z-[7]"
            )}
          >
            {slot}
          </span>
        </div>
      ))}
    </div>
  );
}
