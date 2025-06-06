import {
  useLazyGetTaxQuery,
  useLazyListTaxesQuery,
} from '@/lib/services/taxes'
import { useSendMessageMutation } from '@/lib/services/telegram'
import { useCallback, useEffect, useState } from 'react'

export interface UseTaxSelectOptions {
  taxIds?: number[]
  limit?: number
  type_tax_use: 'sale' | 'purchase'
  tax_kind?: 'tax' | 'withholding'
}

export function useTaxSelect({
  taxIds,
  limit = 10,
  type_tax_use,
  tax_kind = 'withholding',
}: UseTaxSelectOptions) {
  const [getTax] = useLazyGetTaxQuery()
  const [sendMessage] = useSendMessageMutation();

  const [initialOptions, setInitialOptions] = useState<
    { id: number; name: string }[]
  >([])

  useEffect(() => {
    if (!taxIds?.length) {
      setInitialOptions([])
      return
    }
    (async () => {
      try {
        const taxes = await Promise.all(
          taxIds.map((id) => getTax(id, true).unwrap())
        )

        setInitialOptions(
          taxes.map((t) => ({ id: t.id, name: t.name }))
        )
      } catch (err) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-tax-select.ts",
          rawError: err,
          fnLocation: "fetcher"
        }).unwrap().catch((error) => {
          console.error(error);
        });
        setInitialOptions([])
      }
    })()
  }, [taxIds, getTax])

  const [searchTaxes] = useLazyListTaxesQuery()

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await searchTaxes(
          { name: query, type_tax_use },
          true
        ).unwrap()

        return (
          res.data?.filter((t) => t.tax_kind === tax_kind)
            .map((t) => ({ id: t.id, name: t.name })) ?? []
        )
          .slice(0, limit)
      } catch (err) {
        console.error(err)
        return []
      }
    },
    [searchTaxes, limit, type_tax_use]
  )

  return { initialOptions, fetcher }
}
