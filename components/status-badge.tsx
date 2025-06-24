import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const STATUS_STYLES = {
  // Generic lifecycle ---------------------------------------------------------
  draft: { label: "Borrador", bg_color: "bg-slate-100", text_color: "text-slate-800" },
  assigned: { label: "Borrador", bg_color: "bg-slate-100", text_color: "text-slate-800" },
  cancelled: { label: "Cancelada", bg_color: "bg-stone-100", text_color: "text-stone-800" },
  cancel: { label: "Cancelada", bg_color: "bg-stone-100", text_color: "text-stone-800" },
  rejected: { label: "Rechazada", bg_color: "bg-red-100", text_color: "text-red-800" },

  // Approval / ordering -------------------------------------------------------
  approved: { label: "A ordenar", bg_color: "bg-amber-100", text_color: "text-amber-800" },
  to_approve: { label: "A aprobar", bg_color: "bg-amber-100", text_color: "text-amber-800" },

  // Processing / workflow -----------------------------------------------------
  purchase: { label: "A recibir", bg_color: "bg-blue-100", text_color: "text-blue-800" },
  confirmed: { label: "A recibir", bg_color: "bg-blue-100", text_color: "text-blue-800" },
  waiting: { label: "Pendiente", bg_color: "bg-yellow-100", text_color: "text-yellow-800" },
  posted: { label: "Pendiente", bg_color: "bg-blue-100", text_color: "text-blue-800" },
  ordered: { label: "Ordenada", bg_color: "bg-green-100", text_color: "text-green-800" },
  in_process: { label: "En proceso", bg_color: "bg-yellow-100", text_color: "text-yellow-800" },

  // Completion ----------------------------------------------------------------
  done: { label: "Completada", bg_color: "bg-green-100", text_color: "text-green-800" },
  paid: { label: "Completado", bg_color: "bg-green-100", text_color: "text-green-800" },
  overdue: { label: "Vencida", bg_color: "bg-red-100", text_color: "text-red-800" },

  // Boolean-like --------------------------------------------------------------
  true: { label: "Activo", bg_color: "bg-blue-100", text_color: "text-blue-800" },
  false: { label: "Inactivo", bg_color: "bg-slate-100", text_color: "text-slate-800" },

  // Medical management --------------------------------------------------------
  signed: { label: "Firmada", bg_color: "bg-green-100", text_color: "text-green-800" },

  // Upper-case aliases (convert to lower-case in code path) -------------------
  DRAFT: { label: "Borrador", bg_color: "bg-slate-100", text_color: "text-slate-800" },
  SIGNED: { label: "Firmada", bg_color: "bg-green-100", text_color: "text-green-800" },
} as const;

export interface StatusBadgeProps {
  status?: keyof typeof STATUS_STYLES;
  className?: string;
}

/**
 * Renders a colored Badge for a given status code using the unified status map.
 * If the status code is unknown, it falls back to neutral gray styling.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) return null;

  const key = String(status);
  const style = STATUS_STYLES[key as keyof typeof STATUS_STYLES] || STATUS_STYLES[key.toLowerCase() as keyof typeof STATUS_STYLES] || {
    label: key,
    bg_color: "bg-slate-100",
    text_color: "text-slate-800",
  };

  return (
    <Badge
      variant="custom"
      className={cn(
        `${style.bg_color} ${style.text_color} border-none rounded-sm`,
        className,
      )}
    >
      {style.label}
    </Badge>
  );
}

export default StatusBadge; 