import { useGetCustomerQuery } from "@/lib/services/customers";
import { useLazyListCustomersQuery } from "@/lib/services/customers";
import { useCallback, useMemo } from "react"
import { CustomerList } from "../sales/customers/schema/customers";
import { useSendMessageMutation } from "@/lib/services/telegram";

interface UseCustomerSelectOptions<O = { id: number; name: string }> {
  customerId?: number
  limit?: number
  skip?: boolean
  filter?: (s: CustomerList) => boolean
  map?: (s: CustomerList) => O
}

export function useCustomerSelect<
  O = { id: number; name: string },
>({
  customerId,
  limit = 10,
  skip = false,
  filter,
  map,
}: UseCustomerSelectOptions<O> = {}) {
  const [searchCustomers] = useLazyListCustomersQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: selectedCustomer } = useGetCustomerQuery(customerId!, {
    skip: !customerId || skip,
  })

  const mapFn = useCallback(
    (s: CustomerList): O =>
      map ? map(s) : ({ id: s.id, name: s.name } as O),
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedCustomer) return []
    return [{ id: selectedCustomer.id, name: selectedCustomer.name }]
  }, [selectedCustomer])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const res = await searchCustomers({ name: query }, true).unwrap()
        return (res.data ?? [])
          .filter((s) => (filter ? filter(s) : true))
          .slice(0, limit)
          .map(mapFn)
      } catch (err) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-customer-select.ts",
          rawError: err,
          fnLocation: "fetcher"
        }).unwrap().catch((error) => {
          console.error(error);
        });
        return []
      }
    },
    [searchCustomers, limit, filter, mapFn],
  )

  return { initialOptions, fetcher }
}
