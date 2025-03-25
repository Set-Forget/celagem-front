
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"

export interface Option {
  value: string;
  label: string;
}

export interface SearchSelectProps {
  value?: string;
  onSelect: (value: string) => void;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  value,
  onSelect,
  options,
  placeholder = "Selecciona una opción",
  searchPlaceholder = "Buscar..."
}) => {
  const selectedOption = options.find(option => option.value === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between pl-3 font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron opciones.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => onSelect(option.value)}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      option.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSelect;