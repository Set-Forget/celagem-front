import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Table } from "@tanstack/react-table";
import { CalendarFold, Search } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const filtersConfig: Record<string, FilterConfig> = {
  date_range: {
    type: "date_range",
    label: "Rango de fecha",
    options: [
      { label: "Fecha de recepción", value: "reception_date" },
      { label: "Fecha de requerimiento", value: "scheduled_date" },
    ],
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
        {/*         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Columnas
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {typeof column.columnDef.header === "string" && column.columnDef.header}
                    {typeof column.columnDef.header === "function" && column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
        <FilterSelector filtersConfig={filtersConfig} />
      </div>
    </div>
  )
}