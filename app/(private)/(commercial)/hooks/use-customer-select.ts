import { useGetCustomerQuery, useLazyListCustomersQuery } from "@/lib/services/customers"
import { useCallback, useMemo } from "react"

interface Props {
  customerId?: number
  limit?: number
  skip?: boolean
}

export function useCustomerSelect({
  customerId,
  limit = 10,
  skip = false,
}: Props) {
  const [searchCustomer] = useLazyListCustomersQuery()

  const { data: customer } = useGetCustomerQuery(customerId!, {
    skip: !customerId || skip,
  })

  const initialOptions = useMemo(() => {
    if (!customer) return []
    return [{ id: customer.id, name: customer.name }]
  }, [customer])

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await searchCustomer({
          name: query,
        }, true).unwrap()

        return (res.data?.map((customer) => ({
          id: customer.id,
          name: customer.name,
        })) ?? [])
          .slice(0, limit)
      } catch (err) {
        console.error(err)
        return []
      }
    },
    [searchCustomer, limit],
  )

  return { initialOptions, fetcher }
}
