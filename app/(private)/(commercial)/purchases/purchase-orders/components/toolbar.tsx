import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Table } from "@tanstack/react-table";
import { CalendarFold, CircleDashed, Search } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const filtersConfig: Record<string, FilterConfig> = {
  status: {
    type: "multiple",
    options: [
      { label: "Borrador", value: "draft" },
      { label: "A aprobar", value: "to approve" },
      { label: "A recibir", value: "purchase" },
      { label: "Completa", value: "done" },
      { label: "Cancelada", value: "cancel" },
    ], label: "Estado",
    key: "status",
    icon: CircleDashed
  },
  date_range: {
    type: "date_range",
    options: [
      { label: "Fecha de creación", value: "created_at" },
      { label: "Fecha de requerimiento", value: "required_date" },
    ],
    label: "Rango de fecha",
    key: "date_range",
    icon: CalendarFold
  },
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Número", value: "number" },
      { label: "Proveedor", value: "supplier" },
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