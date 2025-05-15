import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Table } from "@tanstack/react-table";
import { CalendarFold, Search } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const filtersConfig: Record<string, FilterConfig> = {
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
      { label: "Centro de costos", value: "cost_center" },
      { label: "Proveedor", value: "supplier" },
      { label: "Tipo de comprobante", value: "voucher_type" },
      { label: "Número de comprobante", value: "voucher_number" },
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