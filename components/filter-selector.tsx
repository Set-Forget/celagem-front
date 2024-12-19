"use client"

import { CalendarFold, CalendarIcon, Check, CircleDashed, ListFilter, LucideProps, Search, X } from "lucide-react"
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
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ActiveFilterChip } from "./active-filter-chip"

type DateRangeFilter = { from: string | Date; to: string | Date };
type SearchFilter = { field: string; query: string };

type SelectedFilters = {
  [key: string]: string[] | DateRangeFilter | SearchFilter;
};

export type FilterConfig = {
  type: string;
  label: string;
  key: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  options?: { label: string; value: string }[];
};

const MultipleFilter = ({
  options,
  selectedValues,
  onChange,
}: {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  setOpen?: (value: boolean) => void;
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

const DateRangeFilter = ({
  selectedValues,
  onChange,
  setOpen,
}: {
  selectedValues: DateRange;
  onChange: (value: DateRange) => void;
  setOpen: (value: boolean) => void;
}) => {
  const [localDate, setLocalDate] = React.useState<DateRange | undefined>(selectedValues);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        <Label>Rango de fecha</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal min-w-[250px] h-8",
                localDate?.from && "text-muted-foreground"
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
            localDate && onChange(localDate);
            setOpen(false);
          }}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};

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
          onValueChange={(value) => setField(value)}
        >
          <SelectTrigger className="h-8">
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
          className="h-8"
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

const isDateRange = (value: any): value is DateRangeFilter =>
  value && typeof value === "object" && "from" in value && "to" in value;

const isSearchFilter = (value: any): value is SearchFilter =>
  value && typeof value === "object" && "field" in value && "query" in value;

const filterComponents: Record<string, React.ComponentType<any>> = {
  multiple: MultipleFilter,
  date_range: DateRangeFilter,
  search: SearchFilter,
};

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
          Object.keys(values).length === 0)
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
                  {...(filterConfig.type === "date_range" && {
                    onChange: (values: { from: Date | undefined; to: Date | undefined }) => handleFilterChange(openedFilter, values),
                    setOpen,
                    selectedValues: selectedFilters[openedFilter] || { from: undefined, to: undefined },
                  })
                  }{...(filterConfig.type === "search" && {
                    options: filterConfig.options,
                    onChange: (values: { field: string; query: string }) => handleFilterChange(openedFilter, values),
                    setOpen,
                    selectedValues: selectedFilters[openedFilter] || { field: filterConfig?.options?.[0].value, query: "" },
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
      {Object.entries(selectedFilters).map(([key, value]) => (
        <ActiveFilterChip
          key={key}
          label={filtersConfig[key]?.label || key}
          value={
            Array.isArray(value)
              ? getLabelsFromValues(key, value)
              : isDateRange(value)
                ? `${format(value.from, "LLL dd, yy")} - ${format(value.to, "LLL dd, yy")}`
                : isSearchFilter(value)
                  ? `${filtersConfig[key].options?.find((opt) => opt.value === value.field)?.label}: "${value.query}"`
                  : "N/A"
          }
          onRemove={() => clearFilter(key)}
        />
      ))}
    </div>
  )
}