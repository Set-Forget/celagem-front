import { AdaptedInvoiceList } from "@/lib/adapters/invoices"
import { useGetInvoiceQuery, useLazyListInvoicesQuery } from "@/lib/services/invoices"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { useCallback, useMemo } from "react"

interface UseInvoiceSelectOptions<O> {
  invoiceId?: number
  limit?: number
  filter?: (invoice: AdaptedInvoiceList) => boolean
  map?: (invoice: AdaptedInvoiceList) => O
}

export function useInvoiceSelect<
  O = { id: number; number: string },
>({
  invoiceId,
  limit = 10,
  filter,
  map,
}: UseInvoiceSelectOptions<O> = {}) {
  const [searchInvoices] = useLazyListInvoicesQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: selectedInvoice } = useGetInvoiceQuery(invoiceId!, { skip: !invoiceId })

  const mapFn = useCallback(
    (b: AdaptedInvoiceList): O =>
      map ? map(b) : { id: b.id, number: b.number } as O,
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedInvoice) return []
    return { id: selectedInvoice.id, number: selectedInvoice.number }
  }, [selectedInvoice])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const invoices = await searchInvoices({}, true).unwrap()
        return invoices
          .filter((i) => (filter ? filter(i) : true))
          .filter((i) => i.number.toString().toLowerCase().includes(query?.toLowerCase() ?? ""))
          .sort((a, b) => b.id - a.id)
          .slice(0, limit)
          .map(mapFn)
      } catch (e) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-invoice-select.ts",
          rawError: e,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchInvoices, filter, limit, mapFn],
  )

  return { initialOptions, fetcher }
}