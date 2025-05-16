import { AsyncSelect } from '@/components/async-select';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useGetProcedureQuery } from '@/lib/services/procedures';
import { useLazyListServicesQuery } from '@/lib/services/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { columnsServices } from '../../[procedure_id]/components/columns-services';
import {
  newProcedureSchema,
  serviceConsumedSchema
} from '../../schema/procedures';

export default function ServicesForm() {
  const params = useParams<{ procedure_id: string }>();
  const procedureId = params.procedure_id;

  const { data: procedure, isLoading: isProcedureLoading } =
    useGetProcedureQuery(procedureId);

  const { setValue, control, watch } =
    useFormContext<z.infer<typeof newProcedureSchema>>();

  const servicesForm = useForm<z.infer<typeof serviceConsumedSchema>>({
    resolver: zodResolver(serviceConsumedSchema),
  });

  const [getServices, { data: services }] = useLazyListServicesQuery();

  const handleGetServices = async () => {
    try {
      const services = await getServices().unwrap();
      return services.data.map((service) => ({
        label: service.code,
        value: service.id,
      }));
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      return [];
    }
  };

  const serviceOnSubmit = (data: z.infer<typeof serviceConsumedSchema>) => {
    setValue('services', [...watch('services'), data]);
    servicesForm.resetField('id');
    servicesForm.resetField('qty');
  };

  const onSubmitDelete = (data: z.infer<typeof serviceConsumedSchema>) => {
    console.log(data);
  };

  const onSubmitAdd = () => {
    console.log('Add service');
  };

  const serviceExtendedSchema = serviceConsumedSchema.merge(
    z.object({
      qty: z.number(),
    })
  );

  const columnsServicesExtended = [
    ...columnsServices.filter((column) => column.id !== 'select'),
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({
        row,
      }: {
        row: { original: z.infer<typeof serviceExtendedSchema> };
      }) => (
        <div className="capitalize flex gap-1">
          <div>{row.original.qty}</div>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <Trash
          className="-ms-0.5 me-1.5 cursor-pointer hover:text-red-500"
          size={20}
          aria-hidden="true"
          onClick={() => {
            // TODO: Implement delete functionality
            console.log('Delete patient:', row.original);
          }}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <FormField
          control={servicesForm.control}
          name="id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <AsyncSelect<any, string>
                  label="Servicio"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar servicio"
                  fetcher={handleGetServices}
                  getDisplayValue={(item) => item.label}
                  getOptionValue={(item) => item.value}
                  renderOption={(item) => <div>{item.label}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  noResultsMessage="No se encontraron servicios"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={servicesForm.control}
          name="qty"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Input
                placeholder="Cantidad"
                type="tel"
                {...field}
                value={servicesForm.getValues().qty ?? ''}
              />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          // className="mt-2"
          onClick={() => {
            serviceOnSubmit(servicesForm.getValues());
          }}
        >
          Agregar
        </Button>
      </div>
      <Separator />

      <>
        <div className="px-4 flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Puestos de trabajo</h2>
          </div>

        </div>
      </>
    </div>
  );
}
