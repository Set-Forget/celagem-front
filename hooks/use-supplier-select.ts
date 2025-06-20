import {
  useGetSupplierQuery,
  useLazyListSuppliersQuery,
} from "@/lib/services/suppliers";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { useCallback, useMemo } from "react";
import { SupplierList } from "../app/(private)/(commercial)/purchases/vendors/schema/suppliers";

interface UseSupplierSelectOptions<O = { id: number; name: string }> {
  supplierId?: number
  limit?: number
  skip?: boolean
  filter?: (s: SupplierList) => boolean
  map?: (s: SupplierList) => O
}

export function useSupplierSelect<
  O = { id: number; name: string },
>({
  supplierId,
  limit = 10,
  skip = false,
  filter,
  map,
}: UseSupplierSelectOptions<O> = {}) {
  const [searchSuppliers] = useLazyListSuppliersQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: selectedSupplier } = useGetSupplierQuery(supplierId!, {
    skip: !supplierId || skip,
  })

  const mapFn = useCallback(
    (s: SupplierList): O =>
      map ? map(s) : ({ id: s.id, name: s.name } as O),
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedSupplier) return []
    return [{ id: selectedSupplier.id, name: selectedSupplier.name }]
  }, [selectedSupplier])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const res = await searchSuppliers({ name: query }, true).unwrap()
        return (res.data ?? [])
          .filter((s) => (filter ? filter(s) : true))
          .slice(0, limit)
          .map(mapFn)
      } catch (err) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-supplier-select.ts",
          rawError: err,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchSuppliers, limit, filter, mapFn],
  )

  return { initialOptions, fetcher }
}
