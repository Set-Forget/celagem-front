"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const suppliers = [
  {
    value: "tech-solutions",
    label: "Tech Solutions Inc.",
  },
  {
    value: "global-suppliers",
    label: "Global Suppliers Ltd.",
  },
  {
    value: "healthcare-providers",
    label: "Healthcare Providers Co.",
  },
  {
    value: "logistics-world",
    label: "Logistics World Group",
  },
  {
    value: "universal-goods",
    label: "Universal Goods Corp.",
  },
];

export default function ProviderSelect() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? suppliers.find((framework) => framework.value === value)?.label
            : "Seleccionar proveedor..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
        <Command>
          <CommandInput placeholder="Buscar proveedor..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontró proveedor.</CommandEmpty>
            <CommandGroup>
              {suppliers.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}