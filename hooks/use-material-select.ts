import { useCallback, useMemo } from "react"
import { useLazyListMaterialsQuery, useGetMaterialQuery } from "@/lib/services/materials"
import { useSendMessageMutation } from "@/lib/services/telegram"

interface UseMaterialSelectOptions {
  productId?: number
  limit?: number
}

export function useMaterialSelect({ productId, limit = 10 }: UseMaterialSelectOptions) {
  const [searchMaterials] = useLazyListMaterialsQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: material } = useGetMaterialQuery(productId!, { skip: !productId })

  const initialOptions = useMemo(() => {
    if (!material) return []
    return [{
      id: material.id,
      name: material.name,
      standard_price: material.standard_price,
      code: material.default_code,
    }]
  }, [material])

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const resp = await searchMaterials({ name: query }, true).unwrap()
        return (
          resp.data?.map((m) => ({
            id: m.id,
            name: m.name,
            standard_price: m.standard_price,
            code: m.default_code,
          })) || []
        ).slice(0, limit)
      } catch (err) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-material-select.ts",
          rawError: err,
          fnLocation: "fetcher"
        })
        return []
      }
    }, [searchMaterials, limit])

  return { initialOptions, fetcher }
}
