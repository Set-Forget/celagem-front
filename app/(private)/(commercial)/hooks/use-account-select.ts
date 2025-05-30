import { useCallback, useMemo } from "react"
import {
  useLazyListAccountingAccountsQuery,
  useGetAccountingAccountQuery,
} from "@/lib/services/accounting-accounts"

interface UseAccountSelectOpts {
  accountId?: number
  limit?: number
}

export function useAccountingAccountSelect({ accountId, limit = 10 }: UseAccountSelectOpts) {
  const [seatchAccount] = useLazyListAccountingAccountsQuery()

  const { data: account } = useGetAccountingAccountQuery(accountId!, {
    skip: !accountId,
  })

  const initialOptions = useMemo(() => {
    if (!account) return []
    return [{ id: account.id, name: account.name, code: account.code }]
  }, [account])

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await seatchAccount({
          account_type: "expense, expense_direct_cost, expense_depreciation, asset_current, asset_non_current, asset_fixed, asset_prepayments",
        },
          true,
        ).unwrap()

        const term = query?.toLowerCase() ?? ""
        return (res.data?.map((account) => ({
          id: account.id,
          name: account.name,
          code: account.code,
        })) ?? [])
          .filter((account) =>
            account.name.toLowerCase().includes(term) ||
            account.code.toLowerCase().includes(term),
          ).slice(0, limit)
      } catch (err) {
        console.error(err)
        return []
      }
    },
    [seatchAccount, limit],
  )

  return { initialOptions, fetcher }
}
