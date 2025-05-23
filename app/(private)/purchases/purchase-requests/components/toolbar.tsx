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
      { label: "Borrador", value: "draft" },
      { label: "A ordenar", value: "approved" },
      { label: "Ordenada", value: "ordered" },
      { label: "Cancelada", value: "cancelled" },
    ], label: "Estado",
    key: "status",
    icon: CircleDashed
  },
  date_range: {
    type: "date_range",
    label: "Rango de fecha",
    options: [
      { label: "Fecha de requerimiento", value: "request_date" },
      //{ label: "Fecha de creación", value: "created_at" },
    ],
    key: "date_range",
    icon: CalendarFold
  },
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Titulo", value: "name" },
    ],
    key: "search",
    icon: Search
  },
};

export default function Toolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
        <FilterSelector filtersConfig={filtersConfig} />
      </div>
    </div>
  )
}