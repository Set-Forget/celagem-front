import { useCallback, useMemo } from "react"
import {
  useGetBillQuery,
  useLazyListBillsQuery,
} from "@/lib/services/bills"
import { AdaptedBillList } from "@/lib/adapters/bills"

interface UseBillSelectOptions<O> {
  billId?: number
  limit?: number
  filter?: (bill: AdaptedBillList) => boolean
  map?: (bill: AdaptedBillList) => O
}

export function useBillSelect<
  O = { id: number; number: string },
>({
  billId,
  limit = 10,
  filter,
  map,
}: UseBillSelectOptions<O> = {}) {
  const [searchBills] = useLazyListBillsQuery()
  const { data: selectedBill } = useGetBillQuery(billId!, { skip: !billId })

  const mapFn = useCallback(
    (b: AdaptedBillList): O =>
      map ? map(b) : { id: b.id, number: b.number } as O,
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedBill) return []
    return { id: selectedBill.id, number: selectedBill.number }
  }, [selectedBill])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const bills = await searchBills({}, true).unwrap()
        return bills
          .filter((b) => (filter ? filter(b) : true))
          .filter((b) => b.number.toString().toLowerCase().includes(query?.toLowerCase() ?? ""))
          .sort((a, b) => b.id - a.id)
          .slice(0, limit)
          .map(mapFn)
      } catch (e) {
        console.error("useBillSelect:", e)
        return []
      }
    },
    [searchBills, filter, limit, mapFn],
  )

  return { initialOptions, fetcher }
}