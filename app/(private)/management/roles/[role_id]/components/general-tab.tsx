import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetRoleQuery } from '@/lib/services/roles';
import { Roles } from '../../schema/roles';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ role_id: string }>();
  const roleId = params.role_id;

  const { data: role, isLoading: isRoleLoading } = useGetRoleQuery(roleId);

  

  const fields: FieldDefinition<Roles>[] = [
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isRoleLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(role!) ?? '';
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
                isRoleLoading ? 'blur-[4px]' : 'blur-none'
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
