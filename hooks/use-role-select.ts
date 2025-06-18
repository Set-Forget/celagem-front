import { useCallback, useMemo } from "react"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { RoleList } from "@/app/(private)/management/roles/schema/roles"
import { useGetRoleQuery, useLazyListRolesQuery } from "@/lib/services/roles"

interface UseRoleSelectOptions<O> {
  roleId?: string
  limit?: number
  filter?: (role: RoleList) => boolean
  map?: (role: RoleList) => O
}

export function useRoleSelect<
  O = { id: string; name: string },
>({
  roleId,
  limit = 10,
  filter,
  map,
}: UseRoleSelectOptions<O> = {}) {
  const [searchRoles] = useLazyListRolesQuery()
  const [sendMessage] = useSendMessageMutation();

  const { data: selectedRole } = useGetRoleQuery(roleId!, { skip: !roleId })

  const mapFn = useCallback(
    (b: RoleList): O =>
      map ? map(b) : { id: b.id, name: b.name } as O,
    [map],
  )

  const initialOptions = useMemo(() => {
    if (!selectedRole) return []
    return { id: selectedRole.id, name: selectedRole.name }
  }, [selectedRole])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const roles = await searchRoles({
          name: query,
        }, true).unwrap()
        return roles.data
          .filter((b) => (filter ? filter(b) : true))
          .slice(0, limit)
          .map(mapFn);
      } catch (e) {
        sendMessage({
          location: "app/(private)/hooks/use-role-select.ts",
          rawError: e,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchRoles, filter, limit, mapFn],
  )

  return { initialOptions, fetcher }
}