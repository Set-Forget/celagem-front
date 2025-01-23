"use client"

import { CalendarIcon, Check, ListFilter, LucideProps } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { ActiveFilterChip } from "./active-filter-chip"
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

type DateRangeFilter = { field: string, from: Date; to: Date };
type SearchFilter = { field: string; query: string };
type DateFilter = { field: string; value: string };

type SelectedFilters = {
  [key: string]: string[] | DateRangeFilter | SearchFilter | DateFilter;
};

export type FilterConfig = {
  type: string;
  label: string;
  key: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  options?: { label: string; value: string }[];
};

/* 
  * MultipleFilter
  * 
  * Componente que permite seleccionar múltiples opciones de un campo.
  * 
  * @param options Opciones de campo.
  * @param selectedValues Valores seleccionados.
  * @param onChange Función que se ejecuta cuando se selecciona una opción.
*/

const MultipleFilter = ({
  options,
  selectedValues,
  onChange,
}: {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) => {
  const selectedSet = new Set(selectedValues)

  const toggleValue = (value: string) => {
    const updatedSet = new Set(selectedSet);
    if (updatedSet.has(value)) {
      updatedSet.delete(value);
    } else {
      updatedSet.add(value);
    }
    onChange(Array.from(updatedSet));
  };

  return (
    <Command>
      <CommandInput placeholder="Filtro..." className="h-8" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            const isSelected = selectedSet.has(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => toggleValue(option.value)}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <Check />
                </div>
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

/* 
  * DateRangeFilter
  * 
  * Componente que permite seleccionar un rango de fecha.
  * 
  * @param options Opciones de campo.
  * @param selectedValues Valores seleccionados.
  * @param onChange Función que se ejecuta cuando se selecciona un rango de fecha.
  * @param setOpen Función que cierra el popover.
*/

const DateRangeFilter = ({
  options,
  selectedValues,
  onChange,
  setOpen,
}: {
  options: { label: string; value: string }[];
  selectedValues: DateRangeFilter;
  onChange: (value: DateRangeFilter) => void;
  setOpen: (value: boolean) => void;
}) => {
  const [localDate, setLocalDate] = React.useState<DateRange | undefined>({
    from: selectedValues.from,
    to: selectedValues.to,
  });
  const [field, setField] = React.useState(selectedValues.field || options[0]?.value);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        <Label>Campo</Label>
        <Select value={field} onValueChange={(value) => setField(value)}>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Seleccionar campo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Label>Rango de fecha</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              size="sm"
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal min-w-[250px] h-7",
                !localDate?.from && "text-muted-foreground"
              )}
            >
              {localDate?.from ? (
                localDate?.to ? (
                  <>
                    {format(localDate.from, "LLL dd, y")} -{" "}
                    {format(localDate.to, "LLL dd, y")}
                  </>
                ) : (
                  format(localDate.from, "LLL dd, y")
                )
              ) : (
                <span>Seleccioná un rango</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={localDate?.from}
              selected={localDate}
              onSelect={(range) => setLocalDate(range as DateRange)}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button
          size="sm"
          className="w-fit ml-auto mt-2 h-7"
          disabled={!localDate?.from || !localDate?.to}
          onClick={() => {
            if (localDate && field) {
              if (localDate?.from && localDate?.to) {
                onChange({ from: localDate.from, to: localDate.to, field });
              }
              setOpen(false);
            }
          }}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};

/* 
  * DateFilter
  *
  * Componente que permite seleccionar una fecha.
  * 
  * @param options Opciones de campo.
  * @param selectedValues Valores seleccionados.
  * @param onChange Función que se ejecuta cuando se selecciona una fecha.
  * @param setOpen Función que cierra el popover.
*/

const DateFilter = ({
  options,
  selectedValues,
  onChange,
  setOpen,
}: {
  options: { label: string; value: string }[];
  selectedValues: { field: string; value: string };
  onChange: (value: { field: string; value: string }) => void;
  setOpen: (value: boolean) => void;
}) => {
  const [localDate, setLocalDate] = React.useState<Date | undefined>(
    selectedValues?.value ? new Date(selectedValues.value) : undefined
  );
  const [field, setField] = React.useState(
    selectedValues?.field || options[0]?.value
  );

  const handleApply = () => {
    if (localDate && field) {
      onChange({
        field,
        value: localDate.toISOString(),
      });
      setOpen(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        <Label>Campo</Label>
        <Select value={field} onValueChange={(value) => setField(value)}>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Seleccionar campo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Label>Fecha</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              size="sm"
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal min-w-[250px] h-7",
                !localDate && "text-muted-foreground"
              )}
            >
              {localDate ? (
                format(localDate, "LLL dd, y")
              ) : (
                <span>Selecciona una fecha</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              defaultMonth={localDate}
              selected={localDate}
              onSelect={(date) => setLocalDate(date as Date)}
            />
          </PopoverContent>
        </Popover>
        <Button
          size="sm"
          className="w-fit ml-auto mt-2 h-7"
          disabled={!localDate}
          onClick={handleApply}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};

/* 
  * SearchFilter
  * 
  * Componente que permite realizar una búsqueda por campo.
  * 
  * @param options Opciones de campo.
  * @param selectedValues Valores seleccionados.
  * @param onChange Función que se ejecuta cuando se realiza una búsqueda.
  * @param setOpen Función que cierra el popover.
*/

const SearchFilter = ({
  options,
  selectedValues,
  onChange,
  setOpen,
}: {
  options: { label: string; value: string }[];
  selectedValues: { field: string; query: string };
  onChange: (value: { field: string; query: string }) => void;
  setOpen: (value: boolean) => void;
}) => {
  const [field, setField] = React.useState(selectedValues?.field || options[0].value);
  const [query, setQuery] = React.useState(selectedValues?.query || "");

  const handleApply = () => {
    onChange({ field, query });
    setOpen(false);
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <div>
        <Label>Buscar por</Label>
        <Select
          value={field}
          onValueChange={(value) => {
            setField(value)
            setQuery("")
          }}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Seleccionar campo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2">
        <Label>Valor</Label>
        <Input
          type="text"
          placeholder="Escribe tu búsqueda"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-7 !text-xs min-w-[250px]"
        />
      </div>

      <Button
        size="sm"
        className="w-fit ml-auto mt-2"
        onClick={handleApply}
        disabled={!query.trim()}
      >
        Aplicar
      </Button>
    </div>
  );
};

/* 
  * SingleFilter
  * 
  * Componente que permite seleccionar una opción de un campo.
  * 
  * @param options Opciones de campo.
  * @param selectedValue Valor seleccionado.
  * @param onChange Función que se ejecuta cuando se selecciona una opción.
  * @param setOpen Función que cierra el popover.
*/

const SingleFilter = ({
  options,
  selectedValue,
  onChange,
}: {
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  setOpen?: (value: boolean) => void;
}) => {
  return (
    <Command className="min-w-[150px]">
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => onChange(option.value)}
            >
              <span>{option.label}</span>
              <Check
                className={cn(
                  "ml-auto",
                  selectedValue === option.value ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};


const isDateRange = (value: any): value is DateRangeFilter =>
  value && typeof value === "object" && "from" in value && "to" in value;

const isSearchFilter = (value: any): value is SearchFilter =>
  value && typeof value === "object" && "field" in value && "query" in value;

const filterComponents: Record<string, React.ComponentType<any>> = {
  multiple: MultipleFilter,
  single: SingleFilter,
  date_range: DateRangeFilter,
  search: SearchFilter,
  date: DateFilter,
};

/* 
  * FilterSelector
  * 
  * Componente que permite seleccionar filtros de una lista de filtros configurados.
  * 
  * Recibe un objeto `filtersConfig` que contiene la configuración de los filtros.
  * 
  * La configuración de un filtro tiene la siguiente forma:
  * 
  * ```ts
  * const filtersConfig: Record<string, FilterConfig> = {
  *   status: {
  *     type: "multiple",
  *     options: [
  *       { label: "Activo", value: "active" },
  *       { label: "Inactivo", value: "inactive" },
  *     ],
  *     label: "Estado",
  *     key: "status",
  *     icon: CircleDashed
  *   },
  *   search: {
  *     type: "search",
  *     label: "Buscar",
  *     options: [
  *       { label: "Nombre", value: "name" },
  *     ],
  *     key: "search",
  *     icon: Search
  *   },
  * };
  * ```
  * 
  * Los tipos de filtro soportados son:
  * 
  * - `multiple`: Filtro de selección múltiple.
  * - `date_range`: Filtro de rango de fecha.
  * - `search`: Filtro de búsqueda.
  * 
  * @param filtersConfig Objeto con la configuración de los filtros.
*/

export default function FilterSelector({
  filtersConfig,
}: {
  filtersConfig: Record<string, FilterConfig>;
}) {
  const [open, setOpen] = React.useState(false);
  const [openedFilter, setOpenedFilter] = React.useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = React.useState<SelectedFilters>({});

  const onOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) {
      setOpenedFilter(null);
    }
  };

  const handleFilterChange = (filterKey: string, values: any) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };

      if (
        (Array.isArray(values) && values.length === 0) ||
        (typeof values === "object" &&
          values !== null &&
          Object.keys(values).length === 0) ||
        values === ""
      ) {
        delete updatedFilters[filterKey];
      } else {
        updatedFilters[filterKey] = values;
      }

      return updatedFilters;
    });
  };

  const getLabelsFromValues = (filterKey: string, values: string[]) => {
    const options = filtersConfig[filterKey]?.options || [];
    return values
      .map((value) => options.find((option) => option.value === value)?.label || value)
      .join(", ");
  };

  const clearFilter = (key: string) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      delete updatedFilters[key];
      return updatedFilters;
    });
  };

  console.log(selectedFilters)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            size="sm"
            className="h-7"
          >
            {Object.keys(selectedFilters).length > 0 ? (
              <div className="h-4 w-4 flex items-center justify-center border border-foreground rounded-full font-semibold font-mono">
                {Object.keys(selectedFilters).length}
              </div>
            ) : <ListFilter className="h-4 w-4" />}
            Filtros
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0 w-fit">
          {openedFilter ? (
            (() => {
              const filterConfig = filtersConfig[openedFilter];
              const FilterComponent = filterComponents[filterConfig.type];

              if (!FilterComponent) return <div></div>;

              return (
                <FilterComponent
                  {...(filterConfig.type === "multiple" && {
                    options: filterConfig.options,
                    onChange: (values: string[]) => handleFilterChange(openedFilter, values),
                    setOpen,
                    selectedValues: selectedFilters[openedFilter] || [],
                  })}
                  {...(filterConfig.type === "single" && {
                    options: filterConfig.options,
                    onChange: (value: string) => handleFilterChange(openedFilter, value),
                    setOpen,
                    selectedValue: selectedFilters[openedFilter] || "",
                  })}
                  {...(filterConfig.type === "date_range" && {
                    options: filterConfig.options,
                    onChange: (values: { from: Date | undefined; to: Date | undefined }) =>
                      handleFilterChange(openedFilter, values),
                    setOpen,
                    selectedValues: selectedFilters[openedFilter] || { from: undefined, to: undefined },
                  })}
                  {...(filterConfig.type === "search" && {
                    options: filterConfig.options,
                    onChange: (values: { field: string; query: string }) =>
                      handleFilterChange(openedFilter, values),
                    setOpen,
                    selectedValues: selectedFilters[openedFilter] || { field: "", query: "" },
                  })}
                  {...(filterConfig.type === "date" && {
                    options: filterConfig.options,
                    onChange: (values: { field: string; value: string }) =>
                      handleFilterChange(openedFilter, values),
                    setOpen,
                    selectedValues: selectedFilters[openedFilter] || { field: "", value: "" },
                  })}
                />
              );
            })()
          ) : (
            <Command>
              <CommandInput placeholder="Filtro..." className="h-8" />
              <CommandList>
                <CommandEmpty>No se encontraron filtros.</CommandEmpty>
                <CommandGroup>
                  {Object.entries(filtersConfig).map(([key, config]) => (
                    <CommandItem
                      key={key}
                      value={config.label}
                      onSelect={() => setOpenedFilter(key)}
                      className="flex items-center"
                    >
                      {config.icon && <config.icon />}
                      {config.label}
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {
                          selectedFilters[key] ? (
                            Array.isArray(selectedFilters[key]) ? selectedFilters[key].length : 1
                          ) : null
                        }
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
      {Object.entries(selectedFilters).map(([key, value]) => {
        const filterConfig = filtersConfig[key];
        return (
          <ActiveFilterChip
            key={key}
            label={
              isDateRange(value)
                ? `${filterConfig?.options?.find((opt) => opt.value === value.field)?.label || "Rango de fecha"}`
                : isSearchFilter(value)
                  ? `${filterConfig?.options?.find((opt) => opt.value === value.field)?.label || "Buscar"}`
                  : typeof value === "object" && "field" in value && "value" in value
                    ? `${filterConfig?.options?.find((opt) => opt.value === value.field)?.label || "Fecha"}`
                    : filterConfig?.label || key
            }
            value={
              Array.isArray(value)
                ? getLabelsFromValues(key, value)
                : isDateRange(value)
                  ? `${format(value.from, "LLL dd, yyyy")} - ${format(value.to, "LLL dd, yyyy")}`
                  : isSearchFilter(value)
                    ? `"${value.query}"`
                    : typeof value === "object" && "field" in value && "value" in value
                      ? `${format(new Date(value.value), "LLL dd, yyyy")}`
                      : typeof value === "string"
                        ? filterConfig?.options?.find((opt) => opt.value === value)?.label || value
                        : "N/A"
            }
            onRemove={() => clearFilter(key)}
          />
        );
      })}
    </div>
  )
}