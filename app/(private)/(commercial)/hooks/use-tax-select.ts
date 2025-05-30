import { useCallback, useMemo } from "react"
import {
  useLazyListTaxesQuery,
  useGetTaxQuery,
} from "@/lib/services/taxes"

export interface UseTaxSelectOptions {
  taxIds?: number[]
  limit?: number
  type_tax_use: "sale" | "purchase"
}

export function useTaxSelect({ taxIds, limit = 10, type_tax_use }: UseTaxSelectOptions) {
  const [searchTaxes] = useLazyListTaxesQuery()

  const firstId = taxIds?.[0]
  const { data: tax } = useGetTaxQuery(firstId!, { skip: !firstId })

  const initialOptions = useMemo(() => {
    if (!tax) return []
    return [{ id: tax.id, name: tax.name }]
  }, [tax])

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await searchTaxes({
          name: query,
          type_tax_use,
        }, true).unwrap()

        return (
          res.data?.map((t) => ({ id: t.id, name: t.name })) ?? []
        ).slice(0, limit)
      } catch (err) {
        console.error(err)
        return []
      }
    },
    [searchTaxes, limit],
  )

  return { initialOptions, fetcher }
}
