import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetMaterialQuery } from '@/lib/services/materials';
import { Locations } from '../../schema/locations';
import { useGetLocationQuery } from '@/lib/services/locations';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ location_id: string }>();
  const locationId = params.location_id;

  const { data: locationData, isLoading: isLocationLoading } =
    useGetLocationQuery(locationId);

  const fields: FieldDefinition<Locations>[] = [
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
    },
    {
      label: 'Nombre completo',
      placeholderLength: 14,
      getValue: (p) => p.complete_name,
    },
    {
      label: 'Uso',
      placeholderLength: 14,
      getValue: (p) => p.usage,
    },
    {
      label: 'Comentario',
      placeholderLength: 14,
      getValue: (p) => p.comment,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isLocationLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(locationData!) ?? '';
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
                isLocationLoading ? 'blur-[2px]' : 'blur-none'
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
