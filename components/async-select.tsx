import { useState, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, Search, Loader2, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

export interface AsyncSelectProps<T, V = string> {
  fetcher: (query?: string) => Promise<T[]>
  renderOption: (option: T) => React.ReactNode
  getOptionValue: (option: T) => V
  getDisplayValue: (option: T) => React.ReactNode
  value: V
  onChange: (value: V, option: T) => void
  label: string
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  noResultsMessage?: string
  modal?: boolean
  actionButton?: React.ReactNode
  getOptionKey?: (option: T) => string
  initialOptions?: T[]
  notFound?: React.ReactNode
  loadingSkeleton?: React.ReactNode
  align?: "start" | "center" | "end"
  creatable?: {
    label?: (input: string) => React.ReactNode
    onCreate: (input: string) => void
  }
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
    creatable,
  } = props

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<T[]>(initialOptions || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedOption, setSelectedOption] = useState<T | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const handleFetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const fetched = await fetcher(searchTerm)

      if (selectedOption) {
        const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)))
        const soKey = keyFn(selectedOption)
        const found = fetched.some((o) => keyFn(o) === soKey)
        if (!found) fetched.unshift(selectedOption)
      }
      setOptions(fetched)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error obteniendo opciones")
    } finally {
      setLoading(false)
    }
  }, [searchTerm, fetcher, selectedOption, getOptionValue, getOptionKey])

  useEffect(() => void handleFetch(), [debouncedSearchTerm])

  const handleSelect = useCallback(
    (selectedKey: string) => {
      const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)))
      const opt = options.find((o) => keyFn(o) === selectedKey)
      if (opt) {
        setSelectedOption(opt)
        onChange(getOptionValue(opt), opt)
      }
      setOpen(false)
    },
    [options, onChange, getOptionValue, getOptionKey]
  )

  useEffect(() => {
    if (!value) return setSelectedOption(null)
    const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)))
    const valueKey =
      typeof value === "object"
        ? getOptionKey
          ? getOptionKey(value as T)
          : String(getOptionValue(value as unknown as T))
        : String(value)
    const opt = options.find((o) => keyFn(o) === valueKey)
    if (opt) setSelectedOption(opt)
  }, [value, options, getOptionValue, getOptionKey])

  useEffect(() => {
    if (!initialOptions?.length) return
    setOptions((prev) => {
      const next = [...prev]
      const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)))
      for (const item of initialOptions) {
        if (!next.some((o) => keyFn(o) === keyFn(item))) next.push(item)
      }
      return next
    })
  }, [initialOptions, getOptionValue, getOptionKey])

  const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)))
  const termTrimmed = searchTerm.trim()
  const showCreateItem =
    !!creatable &&
    termTrimmed.length > 0 &&
    !loading &&
    !options.some((o) => keyFn(o).toLowerCase() === termTrimmed.toLowerCase())

  const handleCreate = () => {
    if (!creatable) return
    creatable.onCreate(termTrimmed)
    setOpen(false)
    setSearchTerm("")
  }

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

      <PopoverContent
        align={align}
        className={cn("min-w-[--radix-popover-trigger-width] p-0", className)}
      >
        <Command>
          <div className="relative border-b w-full">
            {loading && options.length > 0 ? (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              placeholder={`Buscar ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus-visible:ring-0 rounded-b-none border-none pl-8 flex-1"
            />
          </div>

          <CommandList>
            {error && <div className="p-4 text-destructive text-center">{error}</div>}

            {loading && options.length === 0 &&
              (loadingSkeleton || <DefaultLoadingSkeleton />)}

            {!loading && !error && options.length === 0 &&
              (notFound || (
                <CommandEmpty>
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              ))}

            <CommandGroup>
              {options.map((option) => {
                const optionKey = keyFn(option)
                const isSelected = selectedOption && keyFn(selectedOption) === optionKey
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
                )
              })}

              {showCreateItem && (
                <>
                  <CommandSeparator className="my-1" />
                  <CommandItem
                    key="__create__"
                    onSelect={handleCreate}
                  >
                    <Plus className="h-3 w-3" />
                    {creatable?.label
                      ? creatable.label(termTrimmed)
                      : `Crear "${termTrimmed}"`}
                  </CommandItem>
                </>
              )}
            </CommandGroup>
          </CommandList>

          {actionButton && actionButton}
        </Command>
      </PopoverContent>
    </Popover>
  )
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
  )
}
