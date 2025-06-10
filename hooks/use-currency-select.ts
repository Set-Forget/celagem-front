import { useGetCurrencyQuery, useLazyListCurrenciesQuery } from "@/lib/services/currencies"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { useCallback, useMemo } from "react"

interface Props {
  currencyId?: number
  limit?: number
}

export function useCurrencySelect({
  currencyId,
  limit = 10,
}: Props) {
  const [searchCurrency] = useLazyListCurrenciesQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: currency } = useGetCurrencyQuery(currencyId!, {
    skip: !currencyId,
  })

  const initialOptions = useMemo(() => {
    if (!currency) return []
    return [{ id: currency.id, name: currency.name }]
  }, [currency])

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await searchCurrency({
          name: query,
        }, true).unwrap()

        return (res.data?.map((currency) => ({
          id: currency.id,
          name: currency.name,
        })) ?? [])
          .slice(0, limit)
      } catch (err) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-currency-select.ts",
          rawError: err,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchCurrency, limit],
  )

  return { initialOptions, fetcher }
}
