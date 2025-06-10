import {
  useGetAccountingAccountQuery,
  useLazyListAccountingAccountsQuery,
} from "@/lib/services/accounting-accounts"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { useCallback, useMemo } from "react"

interface UseAccountSelectOpts {
  accountId?: number
  limit?: number
  accountTypes?: string[]
}

export function useAccountingAccountSelect({ accountId, limit = 10, accountTypes }: UseAccountSelectOpts) {
  const [searchAccount] = useLazyListAccountingAccountsQuery()
  const [sendMessage] = useSendMessageMutation();

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
        const res = await searchAccount({}, true).unwrap()

        const term = query?.toLowerCase() ?? ""
        let accounts =
          res.data?.map(({ id, name, code, account_type }) => ({
            id,
            name,
            code,
            account_type,
          })) ?? []

        if (accountTypes && accountTypes.length > 0) {
          accounts = accounts.filter(({ account_type }) => accountTypes.includes(account_type))
        }

        return accounts
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
        })
        return []
      }
    },
    [searchAccount, limit, accountTypes],
  )

  return { initialOptions, fetcher }
}
