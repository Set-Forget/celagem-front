import { useCallback, useMemo } from "react"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { useGetCompanyQuery, useLazyListCompaniesQuery } from "@/lib/services/companies"
import { CompanyList } from "@/app/(private)/management/companies/schema/companies"

interface UseCompanySelectOptions<O> {
  roleId?: string
  limit?: number
  filter?: (role: CompanyList) => boolean
  map?: (role: CompanyList) => O
}

export function useCompanySelect<
  O = { id: string; name: string },
>({
  roleId,
  limit = 10,
  filter,
  map,
}: UseCompanySelectOptions<O> = {}) {
  const [searchCompanys] = useLazyListCompaniesQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: selectedCompany } = useGetCompanyQuery(roleId!, { skip: !roleId })

  const mapFn = useCallback(
    (b: CompanyList): O =>
      map ? map(b) : { id: b.id, name: b.name } as O,
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedCompany) return []
    return { id: selectedCompany.id, name: selectedCompany.name }
  }, [selectedCompany])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const companies = await searchCompanys({
          name: query,
        }, true).unwrap()
        return companies.data
          .filter((b) => (filter ? filter(b) : true))
          .slice(0, limit)
          .map(mapFn);
      } catch (e) {
        sendMessage({
          location: "app/(private)/management/companies/hooks/use-company-select.ts",
          rawError: e,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchCompanys, filter, limit, mapFn],
  )

  return { initialOptions, fetcher }
}