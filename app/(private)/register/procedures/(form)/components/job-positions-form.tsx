import { AsyncSelect } from '@/components/async-select';
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from '@/components/phone-input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLazyGetAutocompleteQuery } from '@/lib/services/google-places';
import * as RPNInput from 'react-phone-number-input';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useLazyListPatientsQuery } from '@/lib/services/patients';
import { PatientDetail } from '@/app/(private)/medical-management/patients/schema/patients';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/data-table';
import { useGetBusinessUnitQuery } from '@/lib/services/business-units';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  jobPositionConsumedSchema,
  newProcedureJobPositionsSchema,
  newProcedureSchema,
} from '../../schema/procedures';
import { useLazyListJobPositionsQuery } from '@/lib/services/job-positions';
import { columnsJobPositions } from '../../[procedure_id]/components/columns-job-positions';
import {
  JobPositions,
  jobPositionSchema,
} from '../../../job-positions/schema/job-positions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetProcedureQuery } from '@/lib/services/procedures';

export default function JobPositionsForm() {
  const params = useParams<{ procedure_id: string }>();
  const procedureId = params.procedure_id;

  const { data: procedure, isLoading: isProcedureLoading } =
    useGetProcedureQuery(procedureId);

  const { setValue, control, watch } =
    useFormContext<z.infer<typeof newProcedureSchema>>();

  const jobPositionForm = useForm<z.infer<typeof jobPositionConsumedSchema>>({
    resolver: zodResolver(jobPositionConsumedSchema),
  });

  const [getJobPositions, { data: jobPositions }] =
    useLazyListJobPositionsQuery();

  const handleGetJobPositions = async () => {
    try {
      const jobPositions = await getJobPositions().unwrap();
      return jobPositions.data.map((jobPosition) => ({
        label: jobPosition.code,
        value: jobPosition.id,
      }));
    } catch (error) {
      console.error('Error al obtener los pacientes:', error);
      return [];
    }
  };

  const jobPositionOnSubmit = (
    data: z.infer<typeof jobPositionConsumedSchema>
  ) => {
    setValue('job_positions', [...watch('job_positions'), data]);
    jobPositionForm.resetField('id');
    jobPositionForm.resetField('qty');
  };

  const onSubmitDelete = (data: z.infer<typeof newProcedureSchema>) => {
    console.log(data);
  };

  const onSubmitAdd = () => {
    console.log('Add job position');
  };

  const jobPositinExtendedSchema = jobPositionSchema.merge(
    z.object({
      qty: z.number(),
    })
  );

  const columnsJobPositionsExtended = [
    ...columnsJobPositions.filter((column) => column.id !== 'select'),
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({
        row,
      }: {
        row: { original: z.infer<typeof jobPositinExtendedSchema> };
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
          control={jobPositionForm.control}
          name="id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <AsyncSelect<{ label: string; value: string }, string>
                  label="Puesto de trabajo"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar puesto de trabajo"
                  fetcher={handleGetJobPositions}
                  getDisplayValue={(item) => item.label}
                  getOptionValue={(item) => item.value}
                  renderOption={(item) => <div>{item.label}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  noResultsMessage="No se encontraron puestos de trabajo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={jobPositionForm.control}
          name="qty"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Input
                placeholder="Cantidad"
                type="tel"
                {...field}
                value={jobPositionForm.getValues().qty ?? ''}
              />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          // className="mt-2"
          onClick={() => {
            jobPositionOnSubmit(jobPositionForm.getValues());
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
          <DataTable
            data={jobPositions ? jobPositions.data
              .filter((jobPosition) =>
                watch('job_positions')
                  .map((job) => job.id)
                  .includes(jobPosition.id)
              )
              .map((jobPosition) => ({
                ...jobPosition,
                qty:
                  watch('job_positions')
                    .find((job) => job.id === jobPosition.id)?.qty || 0,
              })) : []}
            isLoading={isProcedureLoading}
            columns={columnsJobPositionsExtended}
            pagination={false}
          />
        </div>
      </>
    </div>
  );
}
