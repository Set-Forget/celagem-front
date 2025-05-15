import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetPaymentTermQuery } from '@/lib/services/payment-terms';
import { PaymentTerms } from '../../schema/payment-terms';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ payment_term_id: string }>();
  const paymentTermId = params.payment_term_id;

  const { data: paymentTermData, isLoading: isPaymentTermLoading } = useGetPaymentTermQuery(paymentTermId);

  const fields: FieldDefinition<PaymentTerms>[] = [
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
    },
    {
      label: 'Nota',
      placeholderLength: 14,
      getValue: (p) => p.note,
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
        const displayValue = isPaymentTermLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(paymentTermData!) ?? '';
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
                isPaymentTermLoading ? 'blur-[4px]' : 'blur-none'
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
