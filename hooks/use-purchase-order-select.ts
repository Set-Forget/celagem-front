import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { useLazyListPurchaseOrdersQuery } from "@/lib/services/purchase-orders"
import { AdaptedPurchaseOrderList } from "@/lib/adapters/purchase-order"
import { useCallback, useMemo } from "react"
import { useSendMessageMutation } from "@/lib/services/telegram"

interface UsePurchaseOrderSelectOptions<O> {
  purchaseOrderId?: number
  limit?: number
  filter?: (purchaseOrder: AdaptedPurchaseOrderList) => boolean
  map?: (purchaseOrder: AdaptedPurchaseOrderList) => O
}

export function usePurchaseOrderSelect<
  O = { id: number; sequence_id: string },
>({
  purchaseOrderId,
  limit = 10,
  filter,
  map,
}: UsePurchaseOrderSelectOptions<O> = {}) {
  const [searchPurchaseOrders] = useLazyListPurchaseOrdersQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: selectedPurchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const mapFn = useCallback(
    (b: AdaptedPurchaseOrderList): O =>
      map ? map(b) : { id: b.id, sequence_id: b.sequence_id } as O,
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedPurchaseOrder) return []
    return { id: selectedPurchaseOrder.id, sequence_id: selectedPurchaseOrder.sequence_id }
  }, [selectedPurchaseOrder])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const bills = await searchPurchaseOrders({}, true).unwrap()
        return bills
          .filter((b) => (filter ? filter(b) : true))
          .filter((b) => b?.sequence_id?.toString().toLowerCase().includes(query?.toLowerCase() ?? ""))
          .slice(0, limit)
          .map(mapFn)
      } catch (e) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-purchase-order-select.ts",
          rawError: e,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchPurchaseOrders, filter, limit, mapFn],
  )

  return { initialOptions, fetcher }
}