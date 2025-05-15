import { AsyncSelect } from '@/components/async-select';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useGetBusinessUnitQuery } from '@/lib/services/business-units';
import { useLazyListPatientsQuery } from '@/lib/services/patients';
import { Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { columnsPatients } from '../../[business_unit_id]/components/columns-patients';
import { newBusinessUnitPatientSchema } from '../../schema/business-units';

export default function PatientsForm() {
  const params = useParams<{ business_unit_id: string }>();
  const businessUnitId = params.business_unit_id;

  const { setValue, control } =
    useFormContext<z.infer<typeof newBusinessUnitPatientSchema>>();

  const [getPatients] = useLazyListPatientsQuery();

  const { data: businessUnit, isLoading: isBusinessUnitLoading } =
    useGetBusinessUnitQuery(businessUnitId);

  const handleGetPatients = async () => {
    try {
      const patients = await getPatients().unwrap();
      return patients.data.map((patient) => ({
        label: patient.first_name + ' ' + patient.first_last_name,
        value: patient.id,
      }));
    } catch (error) {
      console.error('Error al obtener los pacientes:', error);
      return [];
    }
  };

  const onSubmitDelete = (
    data: z.infer<typeof newBusinessUnitPatientSchema>
  ) => {
    console.log(data);
  };

  const onSubmitAdd = () => {
    console.log('Add patient');
  };

  const columnsPatientsExtended = [
    ...columnsPatients.filter((column) => column.id !== 'select'),
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
          control={control}
          name="patient_id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              {/* <FormLabel>Paciente</FormLabel> */}
              <FormControl>
                <AsyncSelect<{ label: string; value: string }, string>
                  label="Paciente"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar paciente"
                  fetcher={handleGetPatients}
                  getDisplayValue={(item) => item.label}
                  getOptionValue={(item) => item.value}
                  renderOption={(item) => <div>{item.label}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  noResultsMessage="No se encontraron pacientes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          // className="mt-2"
          onClick={() => {
            onSubmitAdd();
          }}
        >
          Agregar
        </Button>
      </div>
      <Separator />

      <>
        <div className="px-4 flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Pacientes</h2>
          </div>
          <DataTable
            data={businessUnit?.patients || []}
            columns={columnsPatientsExtended}
            pagination={false}
          />
        </div>
      </>
    </div>
  );
}
