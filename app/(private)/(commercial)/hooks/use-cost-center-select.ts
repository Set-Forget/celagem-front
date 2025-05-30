import { useCallback, useMemo } from "react"
import {
  useLazyListCostCentersQuery,
  useGetCostCenterQuery,
} from "@/lib/services/cost-centers"

interface UseCostCenterSelectOpts {
  costCenterId?: number
  limit?: number
}

export function useCostCenterSelect(
  { costCenterId, limit = 10 }: UseCostCenterSelectOpts,
) {
  const [searchCostCenter] = useLazyListCostCentersQuery()
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
        console.error(err)
        return []
      }
    },
    [searchCostCenter, limit],
  )

  return { initialOptions, fetcher }
}
