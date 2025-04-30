import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { Warehouses } from '../../schema/warehouses';
import { useGetWarehouseQuery } from '@/lib/services/warehouses';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ warehouse_id: string }>();
  const warehouseId = params.warehouse_id;

  const { data: warehouseData, isLoading: isWarehouseLoading } =
    useGetWarehouseQuery(warehouseId);

  const fields: FieldDefinition<Warehouses>[] = [
    {
      label: 'Código',
      placeholderLength: 14,
      getValue: (p) => p.code,
    },
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
    },
    {
      label: 'Sede',
      placeholderLength: 14,
      getValue: (p) => p.company.name,
    },
    {
      label: 'Ubicacion',
      placeholderLength: 14,
      getValue: (p) => p.view_location.name,
    },
    {
      label: 'Estado',
      placeholderLength: 14,
      getValue: (p) => (p.active ? 'Activo' : 'Inactivo'),
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isWarehouseLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(warehouseData!) ?? '';
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
                isWarehouseLoading ? 'blur-[2px]' : 'blur-none'
              )}
            >
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );
}
