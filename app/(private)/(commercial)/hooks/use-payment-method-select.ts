import { useGetPaymentMethodQuery, useLazyListPaymentMethodsQuery } from "@/lib/services/payment-methods"
import { useCallback, useMemo } from "react"

interface Props {
  paymentMethodId?: number
  limit?: number
  paymentType: "inbound" | "outbound"
}

export function usePaymentMethodSelect({
  paymentMethodId,
  limit = 10,
  paymentType
}: Props) {
  const [searchPaymentMethod] = useLazyListPaymentMethodsQuery()

  const { data: paymentMethod } = useGetPaymentMethodQuery(paymentMethodId!, {
    skip: !paymentMethodId,
  })

  const initialOptions = useMemo(() => {
    if (!paymentMethod) return []
    return [{ id: paymentMethod.id, name: paymentMethod.name }]
  }, [paymentMethod])

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await searchPaymentMethod({
          name: query,
          payment_type: paymentType,
        }, true).unwrap()

        return (res.data?.map((paymentMethod) => ({
          id: paymentMethod.id,
          name: paymentMethod.name,
        })) ?? [])
          .slice(0, limit)
      } catch (err) {
        console.error(err)
        return []
      }
    },
    [searchPaymentMethod, limit],
  )

  return { initialOptions, fetcher }
}
