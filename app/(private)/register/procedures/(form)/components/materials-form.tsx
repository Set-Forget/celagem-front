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
  materialConsumedSchema,
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
import { useLazyListMaterialsQuery } from '@/lib/services/materials';
import {
  Materials,
  materialsSchema,
} from '../../../materials/schema/materials';
import { ColumnDef } from '@tanstack/react-table';
import { columnsMaterials } from '../../[procedure_id]/components/columns-materials';
import { materialsMock } from '../../../materials/mocks/materials';

export default function MaterialsForm() {
  const params = useParams<{ procedure_id: string }>();
  const procedureId = params.procedure_id;

  const { data: procedure, isLoading: isProcedureLoading } =
    useGetProcedureQuery(procedureId);

  const { setValue, control, watch } =
    useFormContext<z.infer<typeof newProcedureSchema>>();

  const materialsForm = useForm<z.infer<typeof materialConsumedSchema>>({
    resolver: zodResolver(materialConsumedSchema),
  });

  const [getMaterials, { data: materials }] = useLazyListMaterialsQuery();

  const handleGetMaterials = async () => {
    try {
      const materials = { data: materialsMock };
      return materials.data.map((material) => ({
        label: material.code,
        value: material.id,
      }));
    } catch (error) {
      console.error('Error al obtener los materiales:', error);
      return [];
    }
  };

  const materialsOnSubmit = (data: z.infer<typeof materialConsumedSchema>) => {
    setValue('materials', [...watch('materials'), data]);
    materialsForm.resetField('id');
    materialsForm.resetField('qty');
  };

  const onSubmitDelete = (data: z.infer<typeof newProcedureSchema>) => {
    console.log(data);
  };

  const onSubmitAdd = () => {
    console.log('Add material');
  };

  const materialExtendedSchema = materialsSchema.merge(
    z.object({
      qty: z.number(),
    })
  );

  interface MaterialExtended extends Materials {
    qty: number;
  }

  /* const columnsMaterialsExtended: ColumnDef<Partial<Materials>>[] = [
    ...columnsMaterials.filter((column) => column.id !== 'select'),
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({
        row,
      }: {
        row: { original: z.infer<typeof materialExtendedSchema> };
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
  ]; */

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        {/*         <FormField
          control={materialsForm.control}
          name="id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <AsyncSelect<{ label: string; value: string }, string>
                  label="Material"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar material"
                  fetcher={handleGetMaterials}
                  getDisplayValue={(item) => item.label}
                  getOptionValue={(item) => item.value}
                  renderOption={(item) => <div>{item.label}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  noResultsMessage="No se encontraron materiales"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={materialsForm.control}
          name="qty"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Input
                placeholder="Cantidad"
                type="tel"
                {...field}
                value={materialsForm.getValues().qty ?? ''}
              />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          onClick={() => {
            materialsOnSubmit(materialsForm.getValues());
          }}
        >
          Agregar
        </Button>
      </div>
      <Separator />

      <>
        <div className="px-4 flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Materiales</h2>
          </div>
          {/* <DataTable
            data={
              materials
                ? materials.data
                    .filter((material) =>
                      watch('materials')
                        .map((material) => material.id)
                        .includes(material.id.toString())
                    )
                    .map((material) => ({
                      ...material,
                      qty:
                        watch('materials').find(
                          (m) => m.id === material.id.toString()
                        )?.qty || 0,
                      unit_cost: material.cost_unit_price || 0,
                      total_cost:
                        (watch('materials').find(
                          (m) => m.id === material.id.toString()
                        )?.qty || 0) * (material.cost_unit_price || 0),
                      unit: 'Eventos' as const,
                    }))
                : []
            }
            // isLoading={isProcedureLoading}
            columns={columnsMaterialsExtended}
            pagination={false}
          /> */}
        </div>
      </>
    </div>
  );
}
