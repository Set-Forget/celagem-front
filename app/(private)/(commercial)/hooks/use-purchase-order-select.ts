import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { useLazyListPurchaseOrdersQuery } from "@/lib/services/purchase-orders"
import { AdaptedPurchaseOrderList } from "@/lib/adapters/purchase-order"
import { useCallback, useMemo } from "react"

interface UsePurchaseOrderSelectOptions<O> {
  purchaseOrderId?: number
  limit?: number
  filter?: (purchaseOrder: AdaptedPurchaseOrderList) => boolean
  map?: (purchaseOrder: AdaptedPurchaseOrderList) => O
}

export function usePurchaseOrderSelect<
  O = { id: number; number: string },
>({
  purchaseOrderId,
  limit = 10,
  filter,
  map,
}: UsePurchaseOrderSelectOptions<O> = {}) {
  const [searchPurchaseOrders] = useLazyListPurchaseOrdersQuery()
  const { data: selectedPurchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const mapFn = useCallback(
    (b: AdaptedPurchaseOrderList): O =>
      map ? map(b) : { id: b.id, number: b.number } as O,
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedPurchaseOrder) return []
    return { id: selectedPurchaseOrder.id, number: selectedPurchaseOrder.number }
  }, [selectedPurchaseOrder])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const bills = await searchPurchaseOrders({}, true).unwrap()
        return bills
          .filter((b) => (filter ? filter(b) : true))
          .filter((b) => b.number.toString().toLowerCase().includes(query?.toLowerCase() ?? ""))
          .sort((a, b) => b.id - a.id)
          .slice(0, limit)
          .map(mapFn)
      } catch (e) {
        console.error("usePurchaseOrderSelect:", e)
        return []
      }
    },
    [searchPurchaseOrders, filter, limit, mapFn],
  )

  return { initialOptions, fetcher }
}