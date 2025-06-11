import { useCallback, useEffect, useMemo, useState } from "react";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { PermissionList } from "@/app/(private)/management/roles/schema/roles";
import { useLazyListPermissionsQuery } from "@/lib/services/roles";

interface BaseOptions<O> {
  limit?: number;
  companyId?: string;
  filter?: (p: PermissionList) => boolean;
  map?: (p: PermissionList) => O;
}

export interface UsePermissionSelectOptions<O> extends BaseOptions<O> {
  permissionIds?: string | string[];
}

type Initial<O, T> =
  T extends string[] ? O[] :
  T extends string ? O | undefined :
  undefined;

export function usePermissionSelect<
  O = { id: string; name: string },
  T extends string | string[] | undefined = undefined
>({
  permissionIds,
  limit = 10,
  companyId,
  filter,
  map,
}: UsePermissionSelectOptions<O> & { permissionIds?: T } = {}) {

  const [sendMessage] = useSendMessageMutation();
  const [listPermissions] = useLazyListPermissionsQuery();

  const mapFn = useCallback(
    (p: PermissionList): O =>
      map ? map(p) : ({ id: p.id, name: p.name } as unknown as O),
    [map],
  );

  const ids = useMemo<string[]>(
    () => permissionIds
      ? Array.isArray(permissionIds) ? permissionIds : [permissionIds]
      : [],
    [permissionIds],
  );

  const [initialOptions, setInitialOptions] = useState<Initial<O, T>>(
    (() => {
      if (!permissionIds) return undefined as Initial<O, T>;
      return (Array.isArray(permissionIds) ? [] : undefined) as Initial<O, T>;
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
        const { data } = await listPermissions().unwrap();

        const filtered = (data ?? []).filter(p => ids.includes(p.id));
        const mapped = filtered.map(mapFn);

        if (!canceled) {
          setInitialOptions(
            (Array.isArray(permissionIds) ? mapped : mapped[0]) as Initial<O, T>,
          );
        }
      } catch (error) {
        if (!canceled) setInitialOptions(undefined as Initial<O, T>);
        sendMessage({
          location: "hooks/use-permission-select.ts",
          rawError: error,
          fnLocation: "initialOptions",
        });
      }
    })();

    return () => { canceled = true; };
  }, [ids.join(","), mapFn, permissionIds, listPermissions, sendMessage]);

  const fetcher = useCallback(
    async (query?: string): Promise<O[]> => {
      try {
        const { data } = await listPermissions(
          { name: query }, true,
        ).unwrap();

        return (data ?? [])
          .filter(p => filter ? filter(p) : true)
          .slice(0, limit)
          .map(mapFn);
      } catch (error) {
        sendMessage({
          location: "hooks/use-permission-select.ts",
          rawError: error,
          fnLocation: "fetcher",
        });
        return [];
      }
    },
    [listPermissions, companyId, limit, filter, mapFn, sendMessage],
  );

  return { initialOptions, fetcher } as {
    initialOptions: Initial<O, T>;
    fetcher: (query?: string) => Promise<O[]>;
  };
}
