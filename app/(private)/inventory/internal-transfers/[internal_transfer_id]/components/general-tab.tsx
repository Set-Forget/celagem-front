import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { InternalTransfers } from '../../schema/internal-transfers';
import { useGetInternalTransferQuery } from '@/lib/services/internal-transfers';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ internal_transfer_id: string }>();
  const internalTransferId = params.internal_transfer_id;

  const { data: internalTransferData, isLoading: isInternalTransferLoading } =
    useGetInternalTransferQuery(internalTransferId);

  const fields: FieldDefinition<InternalTransfers>[] = [
    {
      label: 'Número',
      placeholderLength: 14,
      getValue: (p) => p.number,
    },
    {
      label: 'Ubicación origen',
      placeholderLength: 14,
      getValue: (p) => p.source_location.name,
    },
    {
      label: 'Ubicación destino',
      placeholderLength: 14,
      getValue: (p) => p.destination_location.name,
    },
    {
      label: 'Nota',
      placeholderLength: 14,
      getValue: (p) => p.note,
    },
    {
      label: 'Fecha programada',
      placeholderLength: 14,
      getValue: (p) => p.scheduled_date,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isInternalTransferLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(internalTransferData!) ?? '';
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
                isInternalTransferLoading ? 'blur-[2px]' : 'blur-none'
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
