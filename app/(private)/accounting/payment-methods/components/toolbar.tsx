import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const filtersConfig: Record<string, FilterConfig> = {
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Nombre", value: "name" },
      { label: "Cuenta contable", value: "payment_account" },
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