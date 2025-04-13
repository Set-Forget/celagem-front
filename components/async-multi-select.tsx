import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Ref,
  forwardRef,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

export const multiSelectVariants = cva("transition", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-accent",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary",
      destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface AsyncMultiSelectProps<T, V>
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue">,
  VariantProps<typeof multiSelectVariants> {
  /** Función asíncrona para obtener las opciones */
  fetcher: (query?: string) => Promise<T[]>;
  /** Función para renderizar cada opción dentro del listado */
  renderOption: (option: T) => React.ReactNode;
  /** Función para mostrar cómo se ve cada opción cuando está seleccionada (Badge) */
  getDisplayValue: (option: T) => React.ReactNode;
  /** Función para obtener el valor interno de cada opción */
  getOptionValue: (option: T) => V;
  /**
   * Función para obtener una key única por cada opción.
   * Si no se provee, se convierte `getOptionValue(option)` a string.
   */
  getOptionKey?: (option: T) => string;
  /** Callback para notificar cuando cambia la selección de valores */
  onValueChange: (value: V[]) => void;
  /** Valor inicial de la selección */
  defaultValue?: V[];
  /** Placeholder que se ve en el trigger cuando no hay selección */
  placeholder?: string;
  /** Cantidad máxima de Badges visibles */
  maxCount?: number;
  /** Permite que el Popover sea modal */
  modalPopover?: boolean;
  /** Clase adicional que se aplicará al botón principal */
  className?: string;
  /** Placeholder para el input de búsqueda */
  searchPlaceholder?: string;
  /** Mensaje de "no hay resultados" */
  noResultsMessage?: string;
  /** Mensaje de error personalizado */
  errorMessage?: React.ReactNode;
  /** Skeleton o loading custom */
  loadingSkeleton?: React.ReactNode;
  /** Opciones iniciales */
  initialOptions?: T[];
  /** Valor controlado */
  value?: V[];
}

function AsyncMultiSelectInner<T, V>(
  {
    fetcher,
    renderOption,
    getDisplayValue,
    getOptionValue,
    getOptionKey,
    onValueChange,
    defaultValue = [],
    placeholder = "Select options",
    searchPlaceholder = "Search...",
    maxCount: userDefinedMaxCount,
    modalPopover = false,
    className,
    variant,
    noResultsMessage = "No hay opciones disponibles",
    errorMessage,
    loadingSkeleton,
    initialOptions,
    ...props
  }: AsyncMultiSelectProps<T, V>,
  ref: Ref<HTMLButtonElement>
) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<V[]>(defaultValue);
  const [options, setOptions] = useState<T[]>(initialOptions || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [dynamicMaxCount, setDynamicMaxCount] = useState<number>(
    userDefinedMaxCount ?? 99999
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const [knownItemsMap, setKnownItemsMap] = useState<Map<V, T>>(() => new Map());

  const handleFetch = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const fetched = await fetcher(query || "");

      setKnownItemsMap((prev) => {
        const newMap = new Map(prev);
        for (const item of fetched) {
          newMap.set(getOptionValue(item), item);
        }
        return newMap;
      });

      setOptions(fetched);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error obteniendo opciones"
      );
    } finally {
      setLoading(false);
    }
  }, [fetcher, getOptionValue]);

  useEffect(() => {
    if (debouncedSearchTerm === "" && initialOptions && initialOptions.length > 0) {
      setOptions(initialOptions);
      setKnownItemsMap((prev) => {
        const newMap = new Map(prev);
        for (const item of initialOptions) {
          newMap.set(getOptionValue(item), item);
        }
        return newMap;
      });
    }
    void handleFetch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const calculateMaxTags = useCallback(() => {
    if (userDefinedMaxCount !== undefined) {
      setDynamicMaxCount(userDefinedMaxCount);
      return;
    }
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const tagWidth = 100;
      const padding = 40;
      const maxTags = Math.floor((containerWidth - padding) / tagWidth);
      setDynamicMaxCount(maxTags < 1 ? 1 : maxTags);
    }
  }, [userDefinedMaxCount]);

  useEffect(() => {
    calculateMaxTags();
    const handleResize = () => {
      calculateMaxTags();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateMaxTags]);

  useEffect(() => {
    if (defaultValue.length === 0 || !defaultValue) return;
    setSelectedValues(defaultValue);
  }, [defaultValue]);

  const toggleOption = useCallback(
    (option: T) => {
      const optionVal = getOptionValue(option);
      const isSelected = selectedValues.some((val) => val === optionVal);
      let newSelectedValues: V[];
      if (isSelected) {
        newSelectedValues = selectedValues.filter((val) => val !== optionVal);
      } else {
        newSelectedValues = [...selectedValues, optionVal];
      }
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    },
    [selectedValues, onValueChange, getOptionValue]
  );

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      modal={modalPopover}
    >
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          {...(({ value, ...rest }) => rest)(props)}
          variant="outline"
          onClick={() => setIsPopoverOpen((prev) => !prev)}
          className={cn(
            "flex w-full pl-3 rounded-sm items-center justify-between [&_svg]:pointer-events-auto text-muted-foreground group",
            selectedValues.length > 0 && "text-inherit",
            className
          )}
        >
          <div ref={containerRef} className="flex justify-between items-center w-full">
            {selectedValues.length > 0 && (
              <div className="flex items-center gap-1">
                {selectedValues.slice(0, dynamicMaxCount).map((val) => {
                  const option = options.find((o) => getOptionValue(o) === val) ?? knownItemsMap.get(val);
                  if (!option) return null;

                  return (
                    <Badge
                      key={
                        getOptionKey
                          ? getOptionKey(option)
                          : String(getOptionValue(option))
                      }
                      onMouseOver={(e) => e.stopPropagation()}
                      className={cn(
                        "badge group-hover:bg-background group-hover:shadow-background",
                        multiSelectVariants({ variant }))}
                    >
                      {getDisplayValue(option)}
                      <X
                        className="!h-3 !w-3 text-muted-foreground hover:text-foreground transition ml-1"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleOption(option);
                        }}
                      />
                    </Badge>
                  );
                })}
                {selectedValues.length > dynamicMaxCount && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span role="button" tabIndex={0}>
                          <Badge
                            onMouseOver={(e) => e.stopPropagation()}
                            className={cn(
                              "badge group-hover:bg-background group-hover:shadow-background",
                              multiSelectVariants({ variant })
                            )}
                          >
                            {`+ ${selectedValues.length - dynamicMaxCount} más`}
                            <X
                              className="!h-3 !w-3 text-muted-foreground hover:text-foreground transition ml-1"
                              onClick={(event) => {
                                event.stopPropagation();
                                const newSelectedValues = selectedValues.slice(0, dynamicMaxCount);
                                setSelectedValues(newSelectedValues);
                                onValueChange(newSelectedValues);
                              }}
                            />
                          </Badge>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background shadow-lg border border-border p-1 rounded-sm">
                        <div className="flex flex-col p-0">
                          {selectedValues.slice(dynamicMaxCount).map((val) => {
                            const option = options.find((o) => getOptionValue(o) === val) ?? knownItemsMap.get(val);
                            if (!option) {
                              return (
                                <Badge
                                  key={String(val)}
                                  onMouseOver={(e) => e.stopPropagation()}
                                  className={cn(
                                    "badge group-hover:bg-background group-hover:shadow-background flex items-center justify-between",
                                    multiSelectVariants({ variant })
                                  )}
                                >
                                  {String(val)}
                                  <X
                                    className="!h-3 !w-3 text-muted-foreground hover:text-foreground transition ml-1 shadow-sm"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedValues((prev) => {
                                        const newVals = prev.filter((x) => x !== val);
                                        onValueChange(newVals);
                                        return newVals;
                                      });
                                    }}
                                  />
                                </Badge>
                              );
                            }
                            return (
                              <Badge
                                key={
                                  getOptionKey
                                    ? getOptionKey(option)
                                    : String(getOptionValue(option))
                                }
                                onMouseOver={(e) => e.stopPropagation()}
                                className={cn(
                                  "badge flex items-center justify-between",
                                  multiSelectVariants({ variant })
                                )}
                              >
                                {getDisplayValue(option)}
                                <X
                                  className="!h-3 !w-3 text-muted-foreground hover:text-foreground transition ml-1 shadow-sm"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    toggleOption(option);
                                  }}
                                />
                              </Badge>
                            );
                          })}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-normal w-full">
                {selectedValues.length > 0 ? "" : placeholder}
              </span>
            </div>
            <ChevronDown className="h-4 cursor-pointer !opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[--radix-popover-trigger-width]"
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Command>
          <div className="relative border-b w-full">
            {loading && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {!loading && (
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus-visible:ring-0 rounded-b-none border-none pl-8 flex-1"
            />
          </div>
          <CommandList>
            {error && (
              <div className="p-4 text-destructive text-center">
                {errorMessage ? errorMessage : error}
              </div>
            )}
            {loading && options.length === 0 && (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {!loading && !error && options.length === 0 && (
              <CommandEmpty>{noResultsMessage}</CommandEmpty>
            )}

            <CommandGroup>
              {options.map((option) => {
                const keyFn = getOptionKey
                  ? getOptionKey
                  : (o: T) => String(getOptionValue(o));
                const optionKey = keyFn(option);

                const isSelected = selectedValues.some(
                  (val) => val === getOptionValue(option)
                );
                if (isSelected) {
                  return null;
                }

                return (
                  <CommandItem
                    key={optionKey}
                    value={optionKey}
                    onSelect={() => toggleOption(option)}
                    className="cursor-pointer"
                  >
                    {renderOption(option)}
                    <Check
                      className={cn(
                        "ml-auto h-3 w-3",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
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

export const AsyncMultiSelect = forwardRef(AsyncMultiSelectInner) as <
  T,
  V
>(
  props: AsyncMultiSelectProps<T, V> & { ref?: React.Ref<HTMLButtonElement> }
) => JSX.Element;
