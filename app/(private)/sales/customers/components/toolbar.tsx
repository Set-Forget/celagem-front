import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Table } from "@tanstack/react-table";
import { CircleDashed, Search } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const filtersConfig: Record<string, FilterConfig> = {
  status: {
    type: "multiple",
    options: [
      { label: "Activo", value: "true" },
      { label: "Inactivo", value: "false" },
    ], label: "Estado",
    key: "status",
    icon: CircleDashed
  },
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Nombre", value: "name" },
      { label: "Identificación fiscal", value: "tax_id" },
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