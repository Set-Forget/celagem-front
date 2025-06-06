import { Check, Loader2, Plus, Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { DialogTitle } from "./ui/dialog"
import { useSendMessageMutation } from "@/lib/services/telegram"

export interface AsyncCommandProps<T, V = string> {
  open: boolean
  onOpenChange: (state: boolean) => void
  fetcher: (query?: string) => Promise<T[]>
  renderOption: (option: T) => React.ReactNode
  getOptionValue: (option: T) => V
  getDisplayValue?: (option: T) => React.ReactNode
  onSelect: (value: V, option: T) => void
  placeholder?: string
  label: string
  initialOptions?: T[]
  noResultsMessage?: string
  loadingSkeleton?: React.ReactNode
  notFound?: React.ReactNode
  getOptionKey?: (option: T) => string
  creatable?: {
    label?: (input: string) => React.ReactNode
    onCreate: (input: string) => void
  }
}

export function AsyncCommand<T, V>(props: AsyncCommandProps<T, V>) {
  const {
    open,
    onOpenChange,
    fetcher,
    renderOption,
    getOptionValue,
    onSelect,
    placeholder = "Buscar…",
    label,
    initialOptions,
    noResultsMessage,
    loadingSkeleton,
    notFound,
    getOptionKey,
    creatable,
  } = props

  const [sendMessage] = useSendMessageMutation();

  const [options, setOptions] = useState<T[]>(initialOptions || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 300)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetcher(search)
      setOptions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error obteniendo opciones")
      sendMessage({
        location: "components/async-command.tsx",
        rawError: e,
        fnLocation: "load"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    } finally {
      setLoading(false)
    }
  }, [search, fetcher])

  useEffect(() => void load(), [debounced])

  const keyFn = getOptionKey ?? ((o: T) => String(getOptionValue(o)))
  const term = search.trim()

  const showCreate =
    !!creatable &&
    term.length > 0 &&
    !loading &&
    !options.some((o) => keyFn(o).toLowerCase() === term.toLowerCase())

  const handleSelect = (key: string) => {
    const opt = options.find((o) => keyFn(o) === key)
    if (opt) {
      onSelect(getOptionValue(opt), opt)
      onOpenChange(false)
    }
  }

  const handleCreate = () => {
    creatable?.onCreate(term)
    onOpenChange(false)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      shouldFilter={false}
    >
      <DialogTitle className="sr-only">
        Async Command
      </DialogTitle>
      <DialogDescription className="sr-only">
        Use this command to quickly access {label.toLowerCase()} and related actions.
      </DialogDescription>
      <div className="flex items-center px-3 h-9 bg-accent m-1 mb-0 rounded-md" cmdk-input-wrapper="">
        {loading && options.length > 0 ? (
          <Loader2 className="mr-2 !h-4 !w-4 shrink-0 animate-spin" />
        ) : (
          <Search className="mr-2 !h-4 !w-4 shrink-0 opacity-50" />
        )}
        <CommandPrimitive.Input
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
          className={cn(
            "flex w-full !h-auto bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 pr-5"
          )}
        />
      </div>
      <CommandList>
        {loading && options.length === 0 &&
          (loadingSkeleton ?? <DefaultSkeleton />)}
        {!loading && !error && options.length === 0 &&
          (notFound ?? (
            <CommandEmpty>
              {noResultsMessage ?? `No se encontraron resultados.`}
            </CommandEmpty>
          ))}
        {options.length > 0 && (
          <CommandGroup className="pt-0" heading={label}>
            {options.map((o) => {
              const k = keyFn(o)
              return (
                <CommandItem key={k} value={k} onSelect={handleSelect}>
                  {renderOption(o)}
                  <Check className="ml-auto h-3 w-3 opacity-0 group-aria-selected:opacity-100" />
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}
        {showCreate && (
          <>
            {options.length > 0 && <CommandSeparator className="my-1" />}
            <CommandItem key="__create__" onSelect={handleCreate}>
              <Plus className="h-3 w-3" />
              {creatable?.label ? creatable.label(term) : `Crear "${term}"`}
            </CommandItem>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

function DefaultSkeleton() {
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
