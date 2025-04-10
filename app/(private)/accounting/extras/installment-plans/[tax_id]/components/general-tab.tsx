import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetTaxQuery } from '@/lib/services/taxes';
import { Taxes } from '../../schema/installment-plans';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ tax_id: string }>();
  const taxId = params.tax_id;

  const { data: taxData, isLoading: isTaxLoading } = useGetTaxQuery(taxId);

  const fields: FieldDefinition<Taxes>[] = [
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
    },
    {
      label: 'Porcentaje',
      placeholderLength: 14,
      getValue: (p) => p.amount?.toString(),
    },
    {
      label: 'Grupo',
      placeholderLength: 14,
      getValue: (p) => p.tax_group,
    },
    {
      label: 'Activo',
      placeholderLength: 14,
      getValue: (p) => (p.active ? 'Si' : 'No'),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isTaxLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(taxData!) ?? '';
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
                isTaxLoading ? 'blur-[4px]' : 'blur-none'
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
