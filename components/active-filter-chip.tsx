import { X } from "lucide-react";
import { Button } from "./ui/button";


export const ActiveFilterChip = ({
  label,
  value,
  onRemove,
}: {
  label: string;
  value: string | string[];
  onRemove: () => void;
}) => {
  const displayValue = Array.isArray(value) ? value.join(", ") : value;

  return (
    <div className="flex items-center gap-2 border rounded-sm pl-2 text-xs h-7 shadow-sm">
      <span className="font-medium border-r flex items-center h-7 pr-2">{label}</span>

      <div className="flex items-center gap-1 h-7">
        <span>{displayValue}</span>
      </div>

      <Button
        onClick={onRemove}
        className="!h-7 !w-7 rounded-tl-none rounded-bl-none border-r-0 shadow-none"
        variant="outline"
        size="icon"
      >
        <X className="shrink-0" />
      </Button>
    </div>
  );
};