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
  console.log(table.getIsSomeRowsSelected())
  console.log(table.getIsAllPageRowsSelected())
  return (
    <div className="flex gap-4 justify-between items-center">
      <FilterSelector filtersConfig={filtersConfig} />
      {(table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected()) && (
        <Button
          size="sm"
          className="h-7"
          variant="outline"
        >
          <FileDown />
          Exportar
        </Button>
      )}

    </div>
  )
}