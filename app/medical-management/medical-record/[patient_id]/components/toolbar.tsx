import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { CalendarFold, CalendarSearch, CircleDashed, FileDown, Search, Tag } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const filtersConfig: Record<string, FilterConfig> = {
  date: {
    type: "date",
    label: "Fecha",
    key: "date",
    options: [
      { label: "Fecha creación", value: "created_at" },
    ],
    icon: CalendarSearch
  },
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Número de visita", value: "visit_number" },
      { label: "Creado por", value: "created_by" },
      { label: "Especialidad", value: "speciality" },
      { label: "Tipo de atención", value: "attention_type" },
      { label: "Sede", value: "headquarter" },
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
        {/* only show if any row is selected */}
        {table.getIsSomePageRowsSelected() && (
          <Button
            size="sm"
            className="h-7"
            variant="ghost"
          >
            <FileDown />
            Exportar
          </Button>
        )}

      </div>
    </div>
  )
}