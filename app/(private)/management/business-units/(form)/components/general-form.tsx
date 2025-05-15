import { AsyncSelect } from '@/components/async-select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useLazyListCompaniesQuery } from '@/lib/services/companies';
import { useFormContext } from 'react-hook-form';

import { z } from 'zod';
import { Companies } from '../../../companies/schema/companies';
import { newBusinessUnitSchema } from '../../schema/business-units';

export default function GeneralForm() {
  const { setValue, control } =
    useFormContext<z.infer<typeof newBusinessUnitSchema>>();

  const [getCompanies] = useLazyListCompaniesQuery();

  const handleGetCompanies = async () => {
    try {
      const companies = await getCompanies().unwrap();
      return companies.data.map((company: Companies) => ({
        label: company.name,
        value: company.id,
      }));
    } catch (error) {
      console.error('Error al obtener la sede:', error);
      return [];
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre(s)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="Nombre de la unidad"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Descripcion</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="Descripcion de la unidad"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="company_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Sede</FormLabel>
            <FormControl>
              <AsyncSelect<{ label: string; value: string }, string>
                label="Sede"
                triggerClassName="!w-full"
                placeholder="Seleccionar sede"
                fetcher={handleGetCompanies}
                getDisplayValue={(item) => item.label}
                getOptionValue={(item) => item.value}
                renderOption={(item) => <div>{item.label}</div>}
                onChange={field.onChange}
                value={field.value}
                noResultsMessage="No se encontraron sedes"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
