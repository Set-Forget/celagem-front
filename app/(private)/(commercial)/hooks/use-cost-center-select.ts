import { useCallback, useMemo } from "react"
import {
  useLazyListCostCentersQuery,
  useGetCostCenterQuery,
} from "@/lib/services/cost-centers"
import { useSendMessageMutation } from "@/lib/services/telegram"

interface UseCostCenterSelectOpts {
  costCenterId?: number
  limit?: number
}

export function useCostCenterSelect(
  { costCenterId, limit = 10 }: UseCostCenterSelectOpts,
) {
  const [searchCostCenter] = useLazyListCostCentersQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: costCenter } = useGetCostCenterQuery(costCenterId!, {
    skip: !costCenterId,
  })

  const initialOptions = useMemo(() => {
    if (!costCenter) return []
    return [{ id: costCenter.id, name: costCenter.name }]
  }, [costCenter])

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await searchCostCenter({ name: query }).unwrap()
        return (
          res.data?.map((costCenter) => ({ id: costCenter.id, name: costCenter.name })) ?? []
        ).slice(0, limit)
      } catch (err) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-cost-center-select.ts",
          rawError: err,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchCostCenter, limit],
  )

  return { initialOptions, fetcher }
}
