import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export interface AsyncSelectProps<T, V = string> {
  /** Async function to fetch options */
  fetcher: (query?: string) => Promise<T[]>;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => V;
  /** Function to get the display value for the selected option */
  getDisplayValue: (option: T) => React.ReactNode;
  /** Currently selected value */
  value: V;
  /** Callback when selection changes */
  onChange: (value: V, option: T) => void;
  /** Label for the select field */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Custom class names */
  className?: string;
  /** Custom trigger button class names */
  triggerClassName?: string;
  /** Custom no results message */
  noResultsMessage?: string;
  /** Allow clearing the selection */
  modal?: boolean;
  actionButton?: React.ReactNode;
  /**
   * Función opcional para obtener un identificador único en formato string para cada opción.
   * Si no se provee, se convertirá a string el resultado de getOptionValue.
   */
  getOptionKey?: (option: T) => string;
  /** Initial options to show */
  initialOptions?: T[];
  /** Mensaje de error o “sin resultados” */
  notFound?: React.ReactNode;
  /** Skeleton/loading custom */
  loadingSkeleton?: React.ReactNode;
  align?: "start" | "center" | "end";
}

export function AsyncSelect<T, V>(props: AsyncSelectProps<T, V>) {
  const {
    fetcher,
    renderOption,
    getOptionValue,
    getDisplayValue,
    value,
    onChange,
    label,
    placeholder = "Select...",
    disabled = false,
    modal = false,
    className,
    triggerClassName,
    noResultsMessage,
    actionButton,
    getOptionKey,
    initialOptions,
    notFound,
    loadingSkeleton,
    align = "start",
  } = props;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>(initialOptions || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedOption, setSelectedOption] = useState<T | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetcher(searchTerm);

      if (selectedOption) {
        const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)));
        const soKey = keyFn(selectedOption);
        const found = fetched.some((o) => keyFn(o) === soKey);

        if (!found) {
          fetched.unshift(selectedOption);
        }
      }

      setOptions(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error obteniendo opciones");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, fetcher, selectedOption, getOptionValue, getOptionKey]);

  useEffect(() => {
    void handleFetch();
  }, [debouncedSearchTerm]);

  const handleSelect = useCallback(
    (selectedKey: string) => {
      const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)));
      const opt = options.find((o) => keyFn(o) === selectedKey);

      if (opt) {
        setSelectedOption(opt);
        onChange(getOptionValue(opt), opt);
      }
      setOpen(false);
    },
    [options, onChange, getOptionValue, getOptionKey]
  );

  useEffect(() => {
    if (!value) {
      setSelectedOption(null);
      return;
    }
    const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)));

    const valueKey =
      typeof value === "object"
        ? getOptionKey
          ? getOptionKey(value as T)
          : String(getOptionValue(value as unknown as T))
        : String(value);

    const opt = options.find((o) => keyFn(o) === valueKey);
    if (opt) {
      setSelectedOption(opt);
    }
  }, [value, options, getOptionValue, getOptionKey]);


  useEffect(() => {
    if (!initialOptions?.length) return;
    setOptions((prev) => {
      const newSet = [...prev];
      const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)));
      for (const item of initialOptions) {
        if (!newSet.some((x) => keyFn(x) === keyFn(item))) {
          newSet.push(item);
        }
      }
      return newSet;
    });
  }, [initialOptions, getOptionValue, getOptionKey]);

  return (
    <Popover modal={modal} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between font-normal pl-3",
            disabled && "opacity-50 cursor-not-allowed",
            !value && "text-muted-foreground",
            triggerClassName
          )}
        >
          <div className="truncate">
            {selectedOption ? getDisplayValue(selectedOption) : placeholder}
          </div>
          <ChevronsUpDown className="opacity-50" size={10} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={cn("min-w-[--radix-popover-trigger-width] p-0", className)}>
        <Command>
          <div className="relative border-b w-full">
            {loading && options.length > 0 ? (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              placeholder={`Buscar ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus-visible:ring-0 rounded-b-none border-none pl-8 flex-1"
            />
          </div>
          <CommandList>
            {error && (
              <div className="p-4 text-destructive text-center">
                {error}
              </div>
            )}
            {loading && options.length === 0 && (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {!loading && !error && options.length === 0 && (
              notFound || (
                <CommandEmpty>
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              )
            )}
            <CommandGroup>
              {options.map((option) => {
                const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)));
                const optionKey = keyFn(option);
                const isSelected =
                  selectedOption &&
                  keyFn(selectedOption) === optionKey;

                return (
                  <CommandItem
                    key={optionKey}
                    value={optionKey}
                    onSelect={handleSelect}
                  >
                    {renderOption(option)}
                    <Check
                      className={cn("ml-auto h-3 w-3", isSelected ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {actionButton && actionButton}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex items-center gap-2 w-full">
            <div className="h-6 w-6 rounded-full animate-pulse bg-muted" />
            <div className="flex flex-col flex-1 gap-1">
              <div className="h-4 w-24 animate-pulse bg-muted rounded" />
              <div className="h-3 w-16 animate-pulse bg-muted rounded" />
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
