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
import { usePathname, useSearchParams } from "next/navigation"
import { DateRange } from "react-day-picker"
import { ActiveFilterChip } from "./active-filter-chip"
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { es } from "date-fns/locale"

type DateRangeFilter = { field: string, from: Date; to: Date };
type SearchFilter = { field: string; query: string };
type DateFilter = { field: string; value: string };

export type SelectedFilters = {
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
                    {format(localDate.from, "LLL dd, y", { locale: es })} -{" "}
                    {format(localDate.to, "LLL dd, y", { locale: es })}
                  </>
                ) : (
                  format(localDate.from, "LLL dd, y", { locale: es })
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
                format(localDate, "LLL dd, y", { locale: es })
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const [openedFilter, setOpenedFilter] = React.useState<string | null>(null);

  const value = React.useMemo(() => {
    const filters: SelectedFilters = {};

    for (const [key, config] of Object.entries(filtersConfig)) {
      const value = searchParams.get(key);
      if (value) {
        try {
          filters[key] = JSON.parse(value);
        } catch (e) {
          console.error(`Error parsing filter "${key}" value: ${value}`);
        }
      }
    }

    return filters;
  }, [searchParams]);

  /**
   * Actualiza la URL con los filtros actuales.
   * Para cada key definida en la configuración de filtros, se establece el valor (codificado en JSON)
   * o se elimina el parámetro si el filtro no está presente.
   */
  const updateURLFilters = (updatedFilters: SelectedFilters) => {
    // Convertimos los parámetros actuales en un objeto
    const currentParams = Object.fromEntries(searchParams.entries());

    // Actualizamos únicamente las keys correspondientes a los filtros definidos
    for (const key in filtersConfig) {
      if (updatedFilters.hasOwnProperty(key)) {
        currentParams[key] = JSON.stringify(updatedFilters[key]);
      } else {
        delete currentParams[key];
      }
    }

    const queryString = new URLSearchParams(currentParams).toString();
    window.history.pushState({}, '', `${pathname}?${queryString}`);
  };

  const onOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) {
      setOpenedFilter(null);
    }
  };

  /**
   * Al cambiar un filtro, se calcula el nuevo objeto de filtros y se actualiza la URL.
   */
  const handleFilterChange = (filterKey: string, newValue: any) => {
    const updatedFilters = { ...value };

    const isEmpty =
      (Array.isArray(newValue) && newValue.length === 0) ||
      (typeof newValue === 'object' && newValue !== null && Object.keys(newValue).length === 0) ||
      newValue === '';

    if (isEmpty) {
      delete updatedFilters[filterKey];
    } else {
      updatedFilters[filterKey] = newValue;
    }

    updateURLFilters(updatedFilters);

  };

  /**
   * Elimina un filtro y actualiza la URL.
   */
  const clearFilter = (key: string) => {
    const updatedFilters = { ...value };
    delete updatedFilters[key];
    updateURLFilters(updatedFilters);
  };

  /**
   * Obtiene un string con los labels a partir de un array de valores para un filtro.
   */
  const getLabelsFromValues = (filterKey: string, values: string[]) => {
    const options = filtersConfig[filterKey]?.options || [];
    return values
      .map(
        (val) => options.find((option) => option.value === val)?.label ?? val
      )
      .join(', ');
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} size="sm" className="h-7">
            {Object.keys(value).length > 0 ? (
              <div className="h-4 w-4 flex items-center justify-center border border-foreground rounded-full font-semibold font-mono">
                {Object.keys(value).length}
              </div>
            ) : (
              <ListFilter className="h-4 w-4" />
            )}
            Filtros
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="p-0 w-fit">
          {openedFilter ? (
            (() => {
              const filterConfig = filtersConfig[openedFilter];
              const FilterComponent = filterComponents[filterConfig.type];

              if (!FilterComponent) return <div></div>;

              switch (filterConfig.type) {
                case 'multiple':
                  return (
                    <FilterComponent
                      options={filterConfig.options}
                      onChange={(vals: string[]) => handleFilterChange(openedFilter, vals)}
                      setOpen={setOpen}
                      selectedValues={value[openedFilter] || []}
                    />
                  );
                case 'single':
                  return (
                    <FilterComponent
                      options={filterConfig.options}
                      onChange={(val: string) => handleFilterChange(openedFilter, val)}
                      setOpen={setOpen}
                      selectedValue={value[openedFilter] || ''}
                    />
                  );
                case 'date_range':
                  return (
                    <FilterComponent
                      options={filterConfig.options}
                      onChange={(vals: { from: Date | undefined; to: Date | undefined }) =>
                        handleFilterChange(openedFilter, vals)
                      }
                      setOpen={setOpen}
                      selectedValues={value[openedFilter] || { from: undefined, to: undefined }}
                    />
                  );
                case 'search':
                  return (
                    <FilterComponent
                      options={filterConfig.options}
                      onChange={(vals: { field: string; query: string }) =>
                        handleFilterChange(openedFilter, vals)
                      }
                      setOpen={setOpen}
                      selectedValues={value[openedFilter] || { field: '', query: '' }}
                    />
                  );
                case 'date':
                  return (
                    <FilterComponent
                      options={filterConfig.options}
                      onChange={(vals: { field: string; value: string }) =>
                        handleFilterChange(openedFilter, vals)
                      }
                      setOpen={setOpen}
                      selectedValues={value[openedFilter] || { field: '', value: '' }}
                    />
                  );
                default:
                  return <div></div>;
              }
            })()
          ) : (
            <Command>
              <CommandInput placeholder="Filtro..." className="h-8" />
              <CommandList>
                <CommandEmpty>No se encontraron filtros.</CommandEmpty>
                <CommandGroup>
                  {Object.entries(filtersConfig).map(([key, config]) => {
                    const isSelected = !!value[key];
                    const count = Array.isArray(value[key])
                      ? (value[key] as any[]).length
                      : isSelected
                        ? 1
                        : null;

                    return (
                      <CommandItem
                        key={key}
                        value={config.label}
                        onSelect={() => setOpenedFilter(key)}
                        className="flex items-center"
                      >
                        {config.icon && <config.icon />}
                        {config.label}
                        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                          {count}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>

      {Object.entries(value).map(([key, val]) => {
        const filterConfig = filtersConfig[key];
        return (
          <ActiveFilterChip
            key={key}
            label={
              // Se mapea el label según el tipo de filtro
              isDateRange(val)
                ? filterConfig?.options?.find((opt) => opt.value === val.field)?.label || 'Rango de fecha'
                : isSearchFilter(val)
                  ? filterConfig?.options?.find((opt) => opt.value === val.field)?.label || 'Buscar'
                  : typeof val === 'object' && 'field' in val && 'value' in val
                    ? filterConfig?.options?.find((opt) => opt.value === val.field)?.label || 'Fecha'
                    : filterConfig?.label || key
            }
            value={
              Array.isArray(val)
                ? getLabelsFromValues(key, val)
                : isDateRange(val)
                  ? `${format(val.from, 'LLL dd, yyyy', { locale: es })} - ${format(val.to, 'LLL dd, yyyy', { locale: es })}`
                  : isSearchFilter(val)
                    ? `"${val.query}"`
                    : typeof val === 'object' && 'field' in val && 'value' in val
                      ? format(new Date(val.value), 'LLL dd, yyyy')
                      : typeof val === 'string'
                        ? filterConfig?.options?.find((opt) => opt.value === val)?.label || val
                        : 'N/A'
            }
            onRemove={() => clearFilter(key)}
          />
        );
      })}
    </div>
  );
}