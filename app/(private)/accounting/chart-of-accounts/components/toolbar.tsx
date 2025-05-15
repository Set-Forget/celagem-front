import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Search, Tag } from "lucide-react";
import { accountTypes } from "../data";

const filtersConfig: Record<string, FilterConfig> = {
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Nombre", value: "name" },
      { label: "Tipo de cuenta", value: "account_type" },
    ],
    key: "search",
    icon: Search
  },
  account_type: {
    label: "Tipo de cuenta",
    options: accountTypes,
    key: "account_type",
    type: "single",
    icon: Tag,
  },
};

export default function Toolbar() {
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