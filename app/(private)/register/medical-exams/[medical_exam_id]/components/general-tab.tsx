import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetClassQuery } from '@/lib/services/classes';
//import { Classes } from '@/app/(private)/management/classes/schema/classes';

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
    useGetClassQuery(classId);

  const fields: FieldDefinition<any>[] = [
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
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
