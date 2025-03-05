import { CircleCheck, CircleX, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function CustomSonner({
  t,
  description,
  variant = "success"
}: {
  t: string | number,
  description: string,
  variant?: 'success' | 'error'
}) {

  return (
    <div className="w-[var(--width)] rounded-lg border border-border bg-background px-4 py-3">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          {
            variant === 'success' ? (
              <CircleCheck
                className="mt-0.5 shrink-0 text-emerald-500"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <CircleX
                className="mt-0.5 shrink-0 text-red-500"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            )
          }
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">
              {description}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <X
            size={16}
            strokeWidth={2}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  )
}