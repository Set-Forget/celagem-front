import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetServiceQuery } from '@/lib/services/services';
import { Services } from '../../schema/services';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ class_id: string }>();
  const classId = params.class_id;

  const { data: classData, isLoading: isClassLoading } =
    useGetServiceQuery(classId);

  const fields: FieldDefinition<Services>[] = [
    {
      label: 'Codigo',
      placeholderLength: 14,
      getValue: (p) => p.code,
    },
    {
      label: 'Costo Total',
      placeholderLength: 14,
      getValue: (p) => p.total_cost.toString(),
    },
    {
      label: 'Unidad',
      placeholderLength: 14,
      getValue: (p) => p.unit,
    },
    {
      label: 'Costo Unitario',
      placeholderLength: 14,
      getValue: (p) => p.unit_cost.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isClassLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(classData!) ?? '';
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
                isClassLoading ? 'blur-[4px]' : 'blur-none'
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
