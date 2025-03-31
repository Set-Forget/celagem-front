import { useGetPatientQuery } from '@/lib/services/patients';
import { cn, getRandomInt, placeholder } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useParams } from 'next/navigation';
import { BusinessUnit } from '../../schema/business-units';
import { useGetBusinessUnitQuery } from '@/lib/services/business-units';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/data-table';
import { columnsPatients } from './columns-patients';
import { columnsUsers } from './columns-users';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ business_unit_id: string }>();
  const businessUnitId = params.business_unit_id;

  const { data: businessUnit, isLoading: isBusinessUnitLoading } =
    useGetBusinessUnitQuery(businessUnitId);

  const fields: FieldDefinition<BusinessUnit>[] = [
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
    },
    {
      label: 'Descripción',
      placeholderLength: 14,
      getValue: (p) => p.description,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const displayValue = isBusinessUnitLoading
            ? placeholder(getRandomInt(20, 10))
            : field.getValue(businessUnit!) ?? '';
          return (
            <div
              className="flex flex-col gap-1"
              key={field.label}
            >
              <label className="text-muted-foreground text-sm">
                {field.label}
              </label>
              <span
                className={cn(
                  'text-sm transition-all duration-300',
                  isBusinessUnitLoading ? 'blur-[4px]' : 'blur-none'
                )}
              >
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
      <Separator />
      <div>
        <div className="px-4 flex flex-col gap-4 flex-1 h-1/2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Pacientes</h2>
          </div>
          <DataTable
            data={businessUnit?.patients || []}
            columns={columnsPatients}
            pagination={true}
          />
        </div>
        <div className="px-4 flex flex-col gap-4 flex-1 h-1/2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Usuarios</h2>
          </div>
          <DataTable
            data={businessUnit?.users || []}
            columns={columnsUsers}
            pagination={true}
          />
        </div>
      </div>
    </div>
  );
}
