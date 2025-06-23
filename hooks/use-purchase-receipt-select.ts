import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { useLazyListPurchaseOrdersQuery } from "@/lib/services/purchase-orders"
import { AdaptedPurchaseOrderList } from "@/lib/adapters/purchase-order"
import { useCallback, useMemo } from "react"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { AdaptedPurchaseReceiptList } from "@/lib/adapters/purchase-receipts"
import { useGetPurchaseReceiptQuery, useLazyListPurchaseReceiptsQuery } from "@/lib/services/purchase-receipts"

interface UsePurchaseReceiptSelectOptions<O> {
  purchaseReceiptId?: number
  limit?: number
  filter?: (purchaseReceipt: AdaptedPurchaseReceiptList) => boolean
  map?: (purchaseReceipt: AdaptedPurchaseReceiptList) => O
}

export function usePurchaseReceiptSelect<
  O = { id: number; sequence_id: string },
>({
  purchaseReceiptId,
  limit = 10,
  filter,
  map,
}: UsePurchaseReceiptSelectOptions<O> = {}) {
  const [searchPurchaseReceipts] = useLazyListPurchaseReceiptsQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: selectedPurchaseReceipt } = useGetPurchaseReceiptQuery(purchaseReceiptId!, { skip: !purchaseReceiptId })

  const mapFn = useCallback(
    (b: AdaptedPurchaseReceiptList): O =>
      map ? map(b) : { id: b.id, sequence_id: b.sequence_id } as O,
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedPurchaseReceipt) return []
    return { id: selectedPurchaseReceipt.id, sequence_id: selectedPurchaseReceipt.sequence_id }
  }, [selectedPurchaseReceipt])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const purchaseReceipts = await searchPurchaseReceipts({}, true).unwrap()
        return purchaseReceipts
          .filter((b) => (filter ? filter(b) : true))
          .filter((b) => b?.sequence_id?.toString().toLowerCase().includes(query?.toLowerCase() ?? ""))
          .slice(0, limit)
          .map(mapFn)
      } catch (e) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-purchase-receipt-select.ts",
          rawError: e,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchPurchaseReceipts, filter, limit, mapFn],
  )

  return { initialOptions, fetcher }
}