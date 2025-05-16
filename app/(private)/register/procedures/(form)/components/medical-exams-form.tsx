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
  medicalExamConsumedSchema,
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
import { useLazyListMedicalExamsQuery } from '@/lib/services/medical-exams';
import { medicalExamSchema } from '../../../medical-exams/schema/medical-exams';
import { columnsMedicalExams } from '../../[procedure_id]/components/columns-medical-exams';

export default function MedicalExamsForm() {
  const params = useParams<{ procedure_id: string }>();
  const procedureId = params.procedure_id;

  const { data: procedure, isLoading: isProcedureLoading } =
    useGetProcedureQuery(procedureId);

  const { setValue, control, watch } =
    useFormContext<z.infer<typeof newProcedureSchema>>();

  const medicalExamsForm = useForm<z.infer<typeof medicalExamConsumedSchema>>({
    resolver: zodResolver(medicalExamConsumedSchema),
  });

  const [getMedicalExams, { data: medicalExams }] =
    useLazyListMedicalExamsQuery();

  const handleGetJobPositions = async () => {
    try {
      const medicalExamsResponse = await getMedicalExams().unwrap();
      return medicalExamsResponse.data.map((medicalExam) => ({
        label: medicalExam.code,
        value: medicalExam.id,
      }));
    } catch (error) {
      console.error('Error al obtener los exámenes médicos:', error);
      return [];
    }
  };

  const medicalExamOnSubmit = (
    data: z.infer<typeof medicalExamConsumedSchema>
  ) => {
    setValue('medical_exams', [...watch('medical_exams'), data]);
    medicalExamsForm.resetField('id');
    medicalExamsForm.resetField('qty');
  };

  const onSubmitDelete = (data: z.infer<typeof newProcedureSchema>) => {
    console.log(data);
  };

  const onSubmitAdd = () => {
    console.log('Add medical exam');
  };

  const medicalExamExtendedSchema = medicalExamSchema.merge(
    z.object({
      qty: z.number(),
    })
  );

  const columnsMedicalExamsExtended = [
    ...columnsMedicalExams.filter((column) => column.id !== 'select'),
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({
        row,
      }: {
        row: { original: z.infer<typeof medicalExamExtendedSchema> };
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
        {/*         <FormField
          control={medicalExamsForm.control}
          name="id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <AsyncSelect<{ label: string; value: string }, string>
                  label="Puesto de trabajo"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar examen médico"
                  fetcher={handleGetMedicalExams}
                  getDisplayValue={(item) => item.label}
                  getOptionValue={(item) => item.value}
                  renderOption={(item) => <div>{item.label}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  noResultsMessage="No se encontraron exámenes médicos"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={medicalExamsForm.control}
          name="qty"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Input
                placeholder="Cantidad"
                type="tel"
                {...field}
                value={medicalExamsForm.getValues().qty ?? ''}
              />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          // className="mt-2"
          onClick={() => {
            medicalExamOnSubmit(medicalExamsForm.getValues());
          }}
        >
          Agregar
        </Button>
      </div>
      <Separator />

      <>
        <div className="px-4 flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Exámenes médicos</h2>
          </div>
          {/* <DataTable
            data={medicalExams
              ? medicalExams.data
              .filter((medicalExam) =>
                watch('medical_exams')
                  .map((medicalExam) => medicalExam.id)
                  .includes(medicalExam.id)
              )
              .map((medicalExam) => ({
                ...medicalExam,
                qty:
                  watch('medical_exams')
                    .find((medicalExam) => medicalExam.id === medicalExam.id)
                    ?.qty || 0,
              }))
            : []}
            isLoading={isProcedureLoading}
            columns={columnsMedicalExamsExtended}
            pagination={false}
          /> */}
        </div>
      </>
    </div>
  );
}
