import { useCallback, useMemo } from "react"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { useLazyListSpecialitiesQuery } from "@/lib/services/specialities"

interface UseSpecialitySelectOptions<O> {
  limit?: number
  filter?: (speciality: { title: string, id: number }) => boolean
  map?: (speciality: { title: string, id: number }) => O
}

export function useSpecialitySelect<
  O = { id: number; title: string },
>({
  limit = 10,
  filter,
  map,
}: UseSpecialitySelectOptions<O> = {}) {
  const [searchSpecialities] = useLazyListSpecialitiesQuery()
  const [sendMessage] = useSendMessageMutation();

  const mapFn = useCallback(
    (b: { title: string, id: number }): O =>
      map ? map(b) : { id: b.id, title: b.title } as O,
    [map],
  )

  const initialOptions = useMemo(() => {
    return []
  }, [])

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const specialities = await searchSpecialities(undefined, true).unwrap()
        return specialities
          .filter((b) => (filter ? filter(b) : true))
          .slice(0, limit)
          .map(mapFn);
      } catch (e) {
        sendMessage({
          location: "app/(private)/hooks/use-speciality-select.ts",
          rawError: e,
          fnLocation: "fetcher"
        })
        return []
      }
    },
    [searchSpecialities, filter, limit, mapFn],
  )

  return { initialOptions, fetcher }
}