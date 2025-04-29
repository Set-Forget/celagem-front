import { cva, type VariantProps } from "class-variance-authority";
import {
  ChevronDown,
  X,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const multiSelectVariants = cva("transition", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-accent",
      secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface MultiSelectProps<T, V>
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'defaultValue'>,
  VariantProps<typeof multiSelectVariants> {
  options: T[];
  onValueChange?: (value: V[]) => void;
  defaultValue?: V[];
  placeholder?: string;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  searchPlaceholder?: string;
  getDisplayValue: (option: T) => React.ReactNode;
  getOptionValue: (option: T) => V;
  renderOption: (option: T) => React.ReactNode;
  getOptionKey: (option: T) => string;
}

function MultiSelectInner<T, V>(
  {
    options,
    onValueChange,
    variant,
    defaultValue = [],
    placeholder = "Seleccionar opciones",
    searchPlaceholder = "Buscar...",
    maxCount: userDefinedMaxCount,
    modalPopover = false,
    asChild = false,
    className,
    getDisplayValue,
    getOptionValue,
    renderOption,
    getOptionKey,
    ...props
  }: MultiSelectProps<T, V>,
  ref: React.Ref<HTMLButtonElement>
) {
  const [selectedValues, setSelectedValues] = React.useState<V[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [dynamicMaxCount, setDynamicMaxCount] = React.useState<number>(
    userDefinedMaxCount ?? 1
  );

  const containerRef = React.useRef<HTMLDivElement>(null);

  const calculateMaxTags = React.useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const tagWidth = 100;
      const padding = 40;
      const maxTags = Math.floor((containerWidth - padding) / tagWidth);
      setDynamicMaxCount(maxTags);
    }
  }, []);

  React.useEffect(() => {
    calculateMaxTags();
    const handleResize = () => {
      calculateMaxTags();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateMaxTags]);

  React.useEffect(() => {
    setSelectedValues(defaultValue);
  }, [defaultValue]);

  const toggleOption = (option: T) => {
    const optionValue = getOptionValue(option);
    const isSelected = selectedValues?.some((val) => val === optionValue);
    let newSelectedValues: V[];
    if (isSelected) {
      newSelectedValues = selectedValues.filter((val) => val !== optionValue);
    } else {
      newSelectedValues = [...selectedValues, optionValue];
    }
    setSelectedValues(newSelectedValues);
    if (onValueChange) {
      onValueChange(newSelectedValues);
    }
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          {...props}
          onClick={handleTogglePopover}
          variant="outline"
          className={cn(
            "flex w-full pl-3 rounded-sm items-center justify-between [&_svg]:pointer-events-auto [&:has(.badge:hover)]:bg-transparent text-muted-foreground",
            selectedValues.length > 0 && "text-inherit",
            className
          )}
        >
          <div ref={containerRef} className="flex justify-between items-center w-full">
            {selectedValues.length > 0 && (
              <div className="flex items-center gap-1">
                {selectedValues.slice(0, dynamicMaxCount).map((val) => {
                  const option = options.find(
                    (o) => getOptionValue(o) === val
                  );
                  return (
                    option && (
                      <Badge
                        key={getOptionKey(option)}
                        onMouseOver={(e) => e.stopPropagation()}
                        className={cn("badge shadow-sm", multiSelectVariants({ variant }))}
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
                    )
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
                              "badge bg-transparent text-foreground border-foreground/1 hover:bg-transparent shadow-sm",
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
                                if (onValueChange) {
                                  onValueChange(newSelectedValues);
                                }
                              }}
                            />
                          </Badge>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background shadow-lg border border-border p-1 rounded-sm">
                        <div className="flex flex-col p-0">
                          {selectedValues.slice(dynamicMaxCount).map((val) => {
                            const option = options.find((o) => getOptionValue(o) === val);
                            return (
                              option && (
                                <Badge
                                  key={getOptionKey(option)}
                                  onMouseOver={(e) => e.stopPropagation()}
                                  className={cn("badge flex items-center justify-between", multiSelectVariants({ variant }))}
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
                              )
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
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No hay opciones disponibles</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optionVal = getOptionValue(option);
                const isSelected = selectedValues.some((val) => val === optionVal);
                if (isSelected) return null;
                return (
                  <CommandItem
                    key={getOptionKey(option)}
                    onSelect={() => toggleOption(option)}
                    className="cursor-pointer"
                  >
                    {renderOption(option)}
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

export const MultiSelect = React.forwardRef(MultiSelectInner) as <
  T,
  V
>(
  props: MultiSelectProps<T, V> & { ref?: React.Ref<HTMLButtonElement> }
) => JSX.Element;

(MultiSelect as any).displayName = "MultiSelect";