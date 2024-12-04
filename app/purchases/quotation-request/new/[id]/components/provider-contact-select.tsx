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

const contacts = [
  {
    value: "linda_watson",
    label: "Lynn Robinson",
    email: "gmckinney@hotmail.com",
  },
  {
    value: "jesus_scott",
    label: "Billy Mack",
    email: "hchavez@sanders.org",
  },
  {
    value: "russell_jones",
    label: "Leslie Rhodes",
    email: "vcantu@hotmail.com",
  },
  {
    value: "andre_johnson",
    label: "Brittany Thompson",
    email: "dawsoncraig@collier.info",
  },
  {
    value: "jeffery_williams",
    label: "Jason Snow",
    email: "maureen39@gmail.com",
  },
];

export default function ProviderContactSelect() {
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
            ? contacts.find((framework) => framework.value === value)?.label
            : "Seleccionar un contacto..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
        <Command>
          <CommandInput placeholder="Buscar un contacto..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontró el contacto.</CommandEmpty>
            <CommandGroup>
              {contacts.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-col">
                    {framework.label}
                    <span className="text-xs font-medium">
                      {framework.email}
                    </span>
                  </div>
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