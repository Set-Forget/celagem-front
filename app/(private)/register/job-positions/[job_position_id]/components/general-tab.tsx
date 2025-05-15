import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetJobPositionQuery } from '@/lib/services/job-positions';
import { JobPositions } from '../../schema/job-positions';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ job_position_id: string }>();
  const jobPositionId = params.job_position_id;

  const { data: jobPositionData, isLoading: isJobPositionLoading } =
    useGetJobPositionQuery(jobPositionId);

  const fields: FieldDefinition<JobPositions>[] = [
    {
      label: 'Código',
      placeholderLength: 14,
      getValue: (p) => p.code,
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
    {
      label: 'Costo Total',
      placeholderLength: 14,
      getValue: (p) => p.total_cost.toString(),
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isJobPositionLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(jobPositionData!) ?? '';
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
                isJobPositionLoading ? 'blur-[4px]' : 'blur-none'
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
