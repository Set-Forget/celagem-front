import { useCallback, useEffect, useMemo, useState } from "react";
import { useSendMessageMutation } from "@/lib/services/telegram";
import {
  useLazyListBusinessUnitsQuery,
  useLazyGetBusinessUnitQuery,
} from "@/lib/services/business-units";
import type { BusinessUnitList } from "@/app/(private)/management/business-units/schema/business-units";

interface BaseOptions<O> {
  limit?: number;
  companyId?: string;
  filter?: (b: BusinessUnitList) => boolean;
  map?: (b: BusinessUnitList) => O;
}
export interface UseBusinessUnitSelectOptions<O>
  extends BaseOptions<O> {
  businessUnitIds?: string | string[];
}

type Initial<O, T> =
  T extends string[]
  ? O[]
  : T extends string
  ? O | undefined
  : undefined;

export function useBusinessUnitSelect<
  O = { id: string; name: string },
  T extends string | string[] | undefined = undefined,
>(
  {
    businessUnitIds,
    limit = 10,
    companyId,
    filter,
    map,
  }: UseBusinessUnitSelectOptions<O> & { businessUnitIds?: T } = {},
) {
  const [searchBusinessUnits] = useLazyListBusinessUnitsQuery();
  const [getBusinessUnit] = useLazyGetBusinessUnitQuery();
  const [sendMessage] = useSendMessageMutation();

  const mapFn = useCallback(
    (b: BusinessUnitList): O =>
      map ? map(b) : ({ id: b.id, name: b.name } as unknown as O),
    [map],
  );

  const ids = useMemo<string[]>(
    () => (businessUnitIds
      ? Array.isArray(businessUnitIds)
        ? businessUnitIds
        : [businessUnitIds]
      : []),
    [businessUnitIds],
  );

  const [initialOptions, setInitialOptions] = useState<Initial<O, T>>(
    (() => {
      if (!businessUnitIds) return undefined as Initial<O, T>;
      return (Array.isArray(businessUnitIds) ? [] : undefined) as Initial<O, T>;
    })(),
  );

  useEffect(() => {
    let canceled = false;
    if (!ids.length) {
      setInitialOptions(undefined as Initial<O, T>);
      return;
    }

    (async () => {
      try {
        const results = await Promise.all(
          ids.map((id) => getBusinessUnit(id, true).unwrap()),
        );
        const mapped = results.map(mapFn);

        if (!canceled) {
          setInitialOptions(
            (Array.isArray(businessUnitIds)
              ? mapped
              : mapped[0]) as Initial<O, T>,
          );
        }
      } catch (error) {
        if (!canceled) setInitialOptions(undefined as Initial<O, T>);
        sendMessage({
          location: "hooks/use-business-unit-select.ts",
          rawError: error,
          fnLocation: "initialOptions",
        });
      }
    })();

    return () => { canceled = true; };
  }, [ids.join(","), mapFn, getBusinessUnit, businessUnitIds, sendMessage]);

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const { data } = await searchBusinessUnits(
          { name: query, company_id: companyId },
          true,
        ).unwrap();

        return data
          .filter((b) => (filter ? filter(b) : true))
          .slice(0, limit)
          .map(mapFn);
      } catch (error) {
        sendMessage({
          location: "hooks/use-business-unit-select.ts",
          rawError: error,
          fnLocation: "fetcher",
        });
        return [];
      }
    },
    [searchBusinessUnits, companyId, limit, filter, mapFn, sendMessage],
  );

  return {
    initialOptions,
    fetcher,
  } as {
    initialOptions: Initial<O, T>;
    fetcher: (query?: string) => Promise<O[]>;
  };
}
