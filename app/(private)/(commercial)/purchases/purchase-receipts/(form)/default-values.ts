import { format } from "date-fns";

export const defaultValues = {
  supplier: undefined,
  reception_date: undefined,
  reception_location: undefined,
  source_location: undefined,
  move_type: "direct" as const,
  notes: "",
  scheduled_date: format(new Date(), "yyyy-MM-dd"),
  items: [],
  purchase_order: undefined,
}