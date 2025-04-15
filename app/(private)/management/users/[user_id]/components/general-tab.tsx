import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { Users } from '../../schema/users';
import { useGetUserQuery } from '@/lib/services/users';
import { useGetRoleQuery } from '@/lib/services/roles';
import { useGetCompanyQuery } from '@/lib/services/companies';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ user_id: string }>();
  const userId = params.user_id;

  const { data: user, isLoading: isUserLoading } = useGetUserQuery(userId);

  const { data: role, isLoading: isRoleLoading } = useGetRoleQuery(
    user?.role_id ?? ''
  );

  const { data: company, isLoading: isCompanyLoading } = useGetCompanyQuery(
    user?.company_id ?? ''
  );

  const fields: FieldDefinition<Users>[] = [
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.first_name + ' ' + p.last_name,
    },
    {
      label: 'Correo Electrónico',
      placeholderLength: 14,
      getValue: (p) => p.email,
    },
    {
      label: 'Sede',
      placeholderLength: 14,
      getValue: (p) => company?.name ?? 'No especificado',
    },
    {
      label: 'Rol',
      placeholderLength: 14,
      getValue: (p) => role?.name ?? 'No especificado',
    },
    {
      label: 'Confirmado',
      placeholderLength: 14,
      getValue: (p) => (p.is_email_confirmed ? 'Sí' : 'No'),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isUserLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(user!) ?? '';
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
                isUserLoading ? 'blur-[4px]' : 'blur-none'
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
