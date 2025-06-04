import { useCallback, useMemo } from "react"
import {
  useLazyListAccountingAccountsQuery,
  useGetAccountingAccountQuery,
} from "@/lib/services/accounting-accounts"
import { usePathname } from "next/navigation"

interface UseAccountSelectOpts {
  accountId?: number
  limit?: number
}

export function useAccountingAccountSelect({ accountId, limit = 10 }: UseAccountSelectOpts) {
  const pathname = usePathname()

  const isPurchases = pathname.includes("purchases")

  const [searchAccount] = useLazyListAccountingAccountsQuery()

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
        const res = await searchAccount({
          account_type: isPurchases
            ? "expense, expense_direct_cost, expense_depreciation, asset_current, asset_non_current, asset_fixed, asset_prepayments"
            : "income, income_other, asset_current, asset_fixed",
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
    [searchAccount, limit],
  )

  return { initialOptions, fetcher }
}
