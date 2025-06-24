import { useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests"
import { useLazyListPurchaseRequestsQuery } from "@/lib/services/purchase-requests"
import { AdaptedPurchaseRequestList } from "@/lib/adapters/purchase-requests"
import { useCallback, useMemo } from "react"
import { useSendMessageMutation } from "@/lib/services/telegram"

interface UsePurchaseRequestSelectOptions<O> {
  purchaseRequestId?: number
  limit?: number
  filter?: (purchaseRequest: AdaptedPurchaseRequestList) => boolean
  map?: (purchaseRequest: AdaptedPurchaseRequestList) => O
}

export function usePurchaseRequestSelect<
  O = { id: number; name: string },
>({
  purchaseRequestId,
  limit = 10,
  filter,
  map,
}: UsePurchaseRequestSelectOptions<O> = {}) {
  const [searchPurchaseRequests] = useLazyListPurchaseRequestsQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: selectedPurchaseRequest } = useGetPurchaseRequestQuery(purchaseRequestId!, { skip: !purchaseRequestId })

  const mapFn = useCallback(
    (b: AdaptedPurchaseRequestList): O =>
      map ? map(b) : { id: b.id, name: b.sequence_id } as O,
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedPurchaseRequest) return []
    return { id: selectedPurchaseRequest.id, name: selectedPurchaseRequest.sequence_id }
  }, [selectedPurchaseRequest])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const bills = await searchPurchaseRequests({}, true).unwrap()
        return bills
          .filter((b) => (filter ? filter(b) : true))
          .filter((b) => b.sequence_id.toString().toLowerCase().includes(query?.toLowerCase() ?? ""))
          .sort((a, b) => b.id - a.id)
          .slice(0, limit)
          .map(mapFn)
      } catch (e) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-purchase-request-select.ts",
          rawError: e,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchPurchaseRequests, filter, limit, mapFn],
  )

  return { initialOptions, fetcher }
}