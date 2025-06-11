'use client';

import { AsyncMultiSelect } from '@/components/async-multi-select';
import { AsyncSelect } from '@/components/async-select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { NewRole } from '../schema/roles';
import { useCompanySelect } from '@/hooks/use-company-select';
import { usePermissionSelect } from '@/hooks/use-permission-select';

export function NewRoleForm() {
  const { control, formState } = useFormContext<NewRole>();

  const { fetcher: handleSearchCompany } = useCompanySelect()
  const { fetcher: handleSearchPermission } = usePermissionSelect()

  return (
    <form className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input
                placeholder="Administrador"
                {...field}
              />
            </FormControl>
            {formState.errors.name ?
              <FormMessage />
              :
              <FormDescription>
                Este será el nombre del rol.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="company_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Compañía</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: string; name: string }, string>
                label="Compañía"
                triggerClassName="!w-full"
                placeholder="Seleccionar compañía"
                fetcher={handleSearchCompany}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                noResultsMessage="No se encontraron compañías"
                modal
              />
            </FormControl>
            {formState.errors.company_id ?
              <FormMessage />
              :
              <FormDescription>
                Compañía a la que pertenece el rol.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="permissions"
        render={({ field }) => (
          <FormItem className="flex flex-col col-span-2">
            <FormLabel className="w-fit">Permisos</FormLabel>
            <FormControl>
              <AsyncMultiSelect<{ id: string, name: string }, string>
                placeholder="Buscar permisos…"
                fetcher={handleSearchPermission}
                defaultValue={field.value}
                value={field.value}
                getOptionValue={(o) => o.id}
                getOptionKey={(o) => String(o.id)}
                renderOption={(o) => <>{o.name}</>}
                getDisplayValue={(o) => <>{o.name}</>}
                noResultsMessage="No se encontraron resultados"
                onValueChange={field.onChange}
                modalPopover
              />
            </FormControl>
            {formState.errors.permissions ?
              <FormMessage />
              :
              <FormDescription>
                Permisos asignados al rol.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </form>
  )
}