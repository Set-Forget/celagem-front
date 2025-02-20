import { cva, type VariantProps } from "class-variance-authority";
import {
  Check,
  CheckIcon,
  ChevronDown,
  X,
  XCircle
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
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  "m-1 transition",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-accent",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /**
   * Placeholder text to be displayed in the search input.
   * Optional, defaults to "Search...".
   */
  searchPlaceholder?: string;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      searchPlaceholder = "Search...",
      maxCount: userDefinedMaxCount,
      modalPopover = false,
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
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

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
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
            <div
              ref={containerRef}
              className="flex justify-between items-center w-full"
            >
              {selectedValues.length > 0 && (
                <div className="flex items-center">
                  {selectedValues.slice(0, dynamicMaxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        onMouseOver={(e) => e.stopPropagation()}
                        className={cn(
                          "badge",
                          multiSelectVariants({ variant })
                        )}
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 mr-2" />
                        )}
                        {option?.label}
                        <X
                          className="!h-3 !w-3 text-muted-foreground hover:text-foreground transition ml-1"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedValues.length > dynamicMaxCount && (
                    <Badge
                      onMouseOver={(e) => e.stopPropagation()}
                      className={cn(
                        "badge bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                        multiSelectVariants({ variant })
                      )}
                    >
                      {`+ ${selectedValues.length - dynamicMaxCount} más`}
                      <X
                        className="!h-3 !w-3 text-muted-foreground hover:text-foreground transition ml-1"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedValues([]);
                          onValueChange([]);
                        }}
                      />
                    </Badge>
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
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9"
              disabled={options.filter((option) => !selectedValues.includes(option.value)).length === 0}
            />
            <CommandList>
              <CommandEmpty>
                No hay opciones disponibles
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  if (isSelected) return null;

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                    >
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
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
);

MultiSelect.displayName = "MultiSelect";
