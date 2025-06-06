import { useCallback, useMemo } from "react"
import {
  useLazyListAccountingAccountsQuery,
  useGetAccountingAccountQuery,
} from "@/lib/services/accounting-accounts"
import { usePathname } from "next/navigation"
import { useSendMessageMutation } from "@/lib/services/telegram"

interface UseAccountSelectOpts {
  accountId?: number
  limit?: number
}

export function useAccountingAccountSelect({ accountId, limit = 10 }: UseAccountSelectOpts) {
  const pathname = usePathname()

  const isPurchases = pathname.includes("purchases")

  const [searchAccount] = useLazyListAccountingAccountsQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: account } = useGetAccountingAccountQuery(accountId!, {
    skip: !accountId,
  })

  const initialOptions = useMemo(() => {
    if (!account) return []
    return [{ id: account.id, name: account.name, code: account.code }]
  }, [account])

  const accountTypes = isPurchases
    ? ["expense", "expense_direct_cost", "expense_depreciation", "asset_current", "asset_non_current", "asset_fixed", "asset_prepayments"]
    : ["income", "income_other", "asset_current", "asset_fixed"];

  const fetcher = useCallback(
    async (query?: string) => {
      try {
        const res = await searchAccount({}, true).unwrap()

        const term = query?.toLowerCase() ?? ""
        return (
          res.data?.map(({ id, name, code, account_type }) => ({
            id,
            name,
            code,
            account_type,
          })) ?? []
        )
          .filter(({ account_type }) => accountTypes.includes(account_type))
          .filter(({ name, code }) => name.toLowerCase().includes(term) || (code ?? "").toLowerCase().includes(term))
          .sort((a, b) => {
            const aExact = a.code?.toLowerCase() === term || a.name.toLowerCase() === term
            const bExact = b.code?.toLowerCase() === term || b.name.toLowerCase() === term
            if (aExact && !bExact) return -1
            if (!aExact && bExact) return 1
            return (a.code ?? "").localeCompare(b.code ?? "", undefined, { numeric: true })
          })
          .slice(0, limit)
      } catch (err) {
        sendMessage({
          location: "app/(private)/(commercial)/hooks/use-account-select.ts",
          rawError: err,
          fnLocation: "fetcher"
        }).unwrap().catch((error) => {
          console.error(error);
        });
        return []
      }
    },
    [searchAccount, limit],
  )

  return { initialOptions, fetcher }
}
