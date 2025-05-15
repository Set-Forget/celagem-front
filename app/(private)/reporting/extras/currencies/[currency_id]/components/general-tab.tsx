import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetCurrencyQuery } from '@/lib/services/currencies';
import { Currencies } from '../../schema/currencies';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ currency_id: string }>();
  const currencyId = params.currency_id;

  const { data: currencyData, isLoading: isCurrencyLoading } = useGetCurrencyQuery(currencyId);

  const fields: FieldDefinition<Currencies>[] = [
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
    },
    {
      label: 'Símbolo',
      placeholderLength: 14,
      getValue: (p) => p.symbol,
    },
    {
      label: 'Tasa',
      placeholderLength: 14,
      getValue: (p) => (p.rate ?? 0).toString(),
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
        const displayValue = isCurrencyLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(currencyData!) ?? '';
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
                isCurrencyLoading ? 'blur-[4px]' : 'blur-none'
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
