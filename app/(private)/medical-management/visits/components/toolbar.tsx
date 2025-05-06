import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Table } from "@tanstack/react-table";
import { CalendarFold, CircleDashed, Search } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const filtersConfig: Record<string, FilterConfig> = {
  status: {
    type: "multiple",
    options: [
      { label: "Pendiente", value: "pending" },
      { label: "Vencida", value: "overdue" },
      { label: "Paga", value: "paid" },
    ], label: "Estado",
    key: "status",
    icon: CircleDashed
  },
  date_range: {
    type: "date_range",
    options: [
      { label: "Fecha de emisión", value: "issue_date" },
      { label: "Fecha de vencimiento", value: "due_date" },
    ],
    label: "Rango de fecha",
    key: "date_range",
    icon: CalendarFold
  },
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Número de factura", value: "invoice_number" },
      { label: "Proveedor", value: "supplier" },
    ],
    key: "search",
    icon: Search
  },
};

export default function Toolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <FilterSelector filtersConfig={filtersConfig} />
    </div>
  )
}