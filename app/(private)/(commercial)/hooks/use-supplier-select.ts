import { useGetSupplierQuery, useLazyListSuppliersQuery } from "@/lib/services/suppliers"
import { useCallback, useMemo } from "react"

interface Props {
  supplierId?: number
  limit?: number
  skip?: boolean
}

export function useSupplierSelect({
  supplierId,
  limit = 10,
  skip = false,
}: Props) {
  const [searchSupplier] = useLazyListSuppliersQuery()

  const { data: supplier } = useGetSupplierQuery(supplierId!, {
    skip: !supplierId || skip,
  })

  const initialOptions = useMemo(() => {
    if (!supplier) return []
    return [{ id: supplier.id, name: supplier.name }]
  }, [supplier])

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await searchSupplier({
          name: query,
        }, true).unwrap()

        return (res.data?.map((supplier) => ({
          id: supplier.id,
          name: supplier.name,
        })) ?? [])
          .slice(0, limit)
      } catch (err) {
        console.error(err)
        return []
      }
    },
    [searchSupplier, limit],
  )

  return { initialOptions, fetcher }
}
