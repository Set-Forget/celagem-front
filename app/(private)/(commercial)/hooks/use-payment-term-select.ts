import { useGetPaymentTermQuery, useLazyListPaymentTermsQuery } from "@/lib/services/payment-terms"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { useCallback, useMemo } from "react"

interface Props {
  paymentTermId?: number
  limit?: number
}

export function usePaymentTermSelect({
  paymentTermId,
  limit = 10,
}: Props) {
  const [searchPaymentTerm] = useLazyListPaymentTermsQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: paymentTerm } = useGetPaymentTermQuery(paymentTermId!, {
    skip: !paymentTermId,
  })

  const initialOptions = useMemo(() => {
    if (!paymentTerm) return []
    return [{ id: paymentTerm.id, name: paymentTerm.name }]
  }, [paymentTerm])

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await searchPaymentTerm({
          name: query,
        }, true).unwrap()

        return (res.data?.map((paymentTerm) => ({
          id: paymentTerm.id,
          name: paymentTerm.name,
        })) ?? [])
          .slice(0, limit)
      } catch (err) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-payment-term-select.ts",
          rawError: err,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchPaymentTerm, limit],
  )

  return { initialOptions, fetcher }
}
